const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString()
);
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const SHEET_RANGE = "會員資料!A2:N";
const HEADERS = [
  "memberId",
  "memberName",
  "lineId",
  "createAt",
  "phone",
  "orderType",
  "remainDelivery",
  "remainVolume",
  "paymentStatus",
  "balance",
  "validMember",
  "bankAccount",
  "remainFreeQuota",
  "totalDeliveryFee",
];

const {
  BASIC_PRICE,
  MONTHS,
  BASIC_DELIVERY,
  BASIC_CUPS,
  PaymentStatus,
} = require("../constants/constants");

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

async function getByLineId(lineId) {
  const members = await getAllMembers();
  return members.find((m) => m.lineId === lineId) || null;
}

async function getAllMembers() {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SHEET_RANGE,
  });

  const rows = res.data.values || [];
  return rows.map((row) => Object.fromEntries(
    HEADERS.map((h, i) => [h, row[i] || ""])
  ));
}

async function getMemberById(memberId) {
  const members = await getAllMembers();
  return members.find((m) => m.memberId === memberId) || null;
}

async function createMember( lineId, memberName, phone) {
  const sheets = await getSheetsClient();

  const {
    BASIC_PRICE,
    MONTHS,
    BASIC_DELIVERY,
    BASIC_CUPS,
    PaymentStatus,
  } = require("../constants/constants");

  const basicFee = BASIC_PRICE * (BASIC_DELIVERY - 1) * MONTHS;
  const balance = BASIC_PRICE * BASIC_DELIVERY * MONTHS;
  const unitQuota = BASIC_PRICE * BASIC_CUPS;
  const remainFreeQuota = Math.floor(balance / (basicFee + unitQuota));

  const memberId = uuidv4();
  const createAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const newRow = [
    memberId,
    memberName,
    lineId,
    createAt,
    phone,
    "",
    BASIC_DELIVERY.toString(),
    "0",
    PaymentStatus.UNPAID,
    balance.toString(),
    "否",
    "",
    remainFreeQuota.toString(),
    "0",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "會員資料!A2:N",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [newRow],
    },
  });

  return memberId;
}

async function updateMember(memberId, updates = {}) {
  const sheets = await getSheetsClient();
  const members = await getAllMembers();

  const index = members.findIndex((m) => m.memberId === memberId);
  if (index === -1) throw new Error("Member not found");

  const row = members[index];
  const updatedRow = HEADERS.map((h) =>
    h in updates ? updates[h] : row[h] || ""
  );

  const range = `會員資料!A${index + 2}:N${index + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [updatedRow],
    },
  });

  return true;
}

async function deleteMember(memberId) {
  const sheets = await getSheetsClient();
  const members = await getAllMembers();

  const index = members.findIndex((m) => m.memberId === memberId);
  if (index === -1) throw new Error("Member not found");

  const range = `會員資料!A${index + 2}:N${index + 2}`;

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range,
  });

  return true;
}

async function checkMemberExists(memberName, phone) {
  const members = await getAllMembers();

  const normalizeName = (str) => (str || "").replace(/\s/g, "").toLowerCase();
  const normalizePhone = (str) => (str || "").replace(/\D/g, "");

  const inputName = normalizeName(memberName);
  const inputPhone = normalizePhone(phone);

  return members.some((m) =>
    normalizeName(m.memberName) === inputName &&
    normalizePhone(m.phone) === inputPhone
  );
}

module.exports = {
  getAllMembers,
  getMemberById,
  getByLineId,
  checkMemberExists,
  createMember,
  updateMember,
  deleteMember,
};
