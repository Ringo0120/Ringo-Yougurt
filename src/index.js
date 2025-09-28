const cors = require("cors");
const express = require("express");
const { middleware, Client } = require("@line/bot-sdk");
require("dotenv").config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client(config);

const memberApi = require("./api/member");
const orderApi = require("./api/order");
const cartApi = require("./api/cart");
const productApi = require("./api/product");

app.use("/api/members", memberApi);
app.use("/api/orders", orderApi);
app.use("/api/cart", cartApi);
app.use("/api/products", productApi);

app.use("/webhook", middleware(config));
app.post("/webhook", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("處理 webhook 發生錯誤：", err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  const message = event.message.text.trim();

  let member = await getByLineId(userId);

  if (!member) {
    try {
      const profile = await client.getProfile(userId);
      const memberId = await MemberService.createMember(userId, profile.displayName, "");
      member = await MemberService.getByLineId(userId);
    } catch (err) {
      console.error("自動綁定會員失敗", err);
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "無法綁定會員，請稍後再試。",
      });
    }
  }

  if (message === "查詢剩餘次數") {
    const replyText = `${member.memberName} 您好\n目前剩餘配送次數為：${member.remainDelivery} 次`;
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: replyText,
    });
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: `你說了：${message}`,
  });
}

app.get("/ping", (req, res) => {
  try {
    res.status(200).json({ status: "UP" });
  } catch (error) {
    console.error("Ping endpoint error:", error);
    res.status(500).json({ status: "DOWN", error: error.message });
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`yougurt backend is running on port ${process.env.PORT || 3000}`);
});
