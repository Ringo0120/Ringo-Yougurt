const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString()
);

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const PRODUCT_RANGE = "商品資料!A2:D";
const PRODUCT_HEADERS = ["productId", "productName", "price", "category"];

const ORDER_RANGE = "訂單資料!A2:O";
const ORDER_HEADERS = [
    "orderId",
    "orderDate",
    "confirmedOrder",
    "desiredDate",
    "deliverDate",
    "deliverStatus",
    "paymentMethod",
    "memberId",
    "orders",
    "totalFee",
    "tax",
    "deliveryFee",
    "recipient",
    "address",
    "invoice",
];

const {
    BASIC_PRICE,
    BASIC_CUPS,
    BASIC_DELIVERY_FEE,
} = require("../constants/constants");

const memberService = require("./memberService");

const { calculateInvoiceAmount } = require("./calculateInvoice");

async function getSheetsClient() {
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const client = await auth.getClient();
    return google.sheets({ version: "v4", auth: client });
}

async function getAllProducts() {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: PRODUCT_RANGE,
    });

    const rows = res.data.values || [];
    return rows.map((row) => {
        const obj = Object.fromEntries(
            PRODUCT_HEADERS.map((h, i) => [h, row[i] || ""])
        );
        obj.price = Number(obj.price) || 0;
        return obj;
    });
}

async function getProductMap() {
    const products = await getAllProducts();
    return Object.fromEntries(products.map((p) => [p.productId, p]));
}


async function getAllOrders() {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: ORDER_RANGE,
    });

    const rows = res.data.values || [];
    return rows.map((row) => {
        const o = Object.fromEntries(
            ORDER_HEADERS.map((h, i) => [h, row[i] ?? ""])
        );
        o.totalFee = Number(o.totalFee) || 0;
        o.tax = Number(o.tax) || 0;
        o.deliveryFee = Number(o.deliveryFee) || 0;
        o.invoice = Number(o.invoice) || 0;
        return o;
    });
}

async function getOrderById(orderId) {
    const all = await getAllOrders();
    return all.find((o) => o.orderId === orderId) || null;
}

async function getOrdersByMemberId(memberId) {
    const all = await getAllOrders();
    return all.filter((o) => o.memberId === memberId);
}

async function getOrdersByLineId(lineId) {
    const all = await getAllOrders();
    return all.filter((o) => o.lineId === lineId);
}

async function createOrder(payload) {
    const {
        lineId,
        recipient,
        address,
        orders = {},
        paymentMethod = "CASH",
        desiredDate,
    } = payload;

    const member = await memberService.getByLineId(lineId);
    if (!member) throw new Error("Member not found");

    const productMap = await getProductMap();

    let items = [];
    let subtotal = 0;
    for (const [pid, qtyRaw] of Object.entries(orders)) {
        const qty = Number(qtyRaw) || 0;
        if (!qty) continue;
        const p = productMap[pid];
        if (!p) continue;
        const lineTotal = p.price * qty;
        items.push({
            productId: p.productId,
            name: p.productName,
            price: p.price,
            qty,
            lineTotal,
            category: p.category,
        });
        subtotal += lineTotal;
    }

    if (items.length === 0) {
        throw new Error("Empty order items");
    }

    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = Number(member.remainDelivery) > 0 ? 0 : (BASIC_DELIVERY_FEE || 0);

    const freeQuota = BASIC_CUPS * BASIC_PRICE;
    const invoice = calculateInvoiceAmount(Number(member.balance) || 0, subtotal, freeQuota);

    const orderId = uuidv4();
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const itemsText = items.map(it => `${it.name} * ${it.qty}`).join("、");

    const row = [
        orderId,
        now,
        "待確認",
        desiredDate || "",
        "",
        "備貨中",
        paymentMethod,
        member.memberId,
        itemsText,
        String(subtotal),
        String(tax),
        String(deliveryFee),
        recipient || "",
        address || "",
        String(invoice),
    ];

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: ORDER_RANGE,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [row] },
    });

    const newBalance = (Number(member.balance) || 0) - subtotal;
    const newRemainDelivery = Math.max((Number(member.remainDelivery) || 0) - 1, 0);
    await memberService.updateMember(member.memberId, {
        balance: String(newBalance),
        remainDelivery: String(newRemainDelivery),
        totalDeliveryFee: String((Number(member.totalDeliveryFee) || 0) + deliveryFee),
    });

    return {
        orderId,
        memberId: member.memberId,
        lineId: member.lineId,
        orderDate: now,
        desiredDate: desiredDate || "",
        recipient: recipient || "",
        address: address || "",
        paymentMethod,
        items,
        subtotal,
        tax,
        deliveryFee,
        invoice,
        status: "待確認",
        deliverStatus: "備貨中",
    };
}

async function updateOrder(orderId, updates = {}) {
    const sheets = await getSheetsClient();
    const orders = await getAllOrders();

    const idx = orders.findIndex((o) => o.orderId === orderId);
    if (idx === -1) throw new Error("Order not found");

    const current = orders[idx];

    const next = { ...current, ...updates };

    if (Array.isArray(next.items)) {
        next.itemsJson = JSON.stringify(next.items);
    }

    const updatedRow = ORDER_HEADERS.map((h) => {
        if (["subtotal", "tax", "deliveryFee", "invoice"].includes(h)) {
            return String(next[h] ?? current[h] ?? "0");
        }
        return (next[h] ?? current[h] ?? "").toString();
    });

    const range = `訂單資料!A${idx + 2}:O${idx + 2}`;
    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range,
        valueInputOption: "RAW",
        requestBody: { values: [updatedRow] },
    });

    return true;
}

async function deleteOrder(orderId) {
    const sheets = await getSheetsClient();
    const orders = await getAllOrders();

    const idx = orders.findIndex((o) => o.orderId === orderId);
    if (idx === -1) throw new Error("Order not found");

    const range = `訂單資料!A${idx + 2}:O${idx + 2}`;
    await sheets.spreadsheets.values.clear({
        spreadsheetId: SHEET_ID,
        range,
    });

    return true;
}

module.exports = {
    getAllProducts,
    getProductMap,
    getAllOrders,
    getOrderById,
    getOrdersByMemberId,
    getOrdersByLineId,
    createOrder,
    updateOrder,
    deleteOrder,
};
