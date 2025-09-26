const express = require("express");
const router = express.Router();
const orderService = require("../services/orderService");

router.get("/", async (req, res) => {
  try {
    const data = await orderService.getAllOrders();
    res.json(data);
  } catch (err) {
    console.error("取得訂單清單失敗：", err);
    res.status(500).json({ error: "取得訂單清單失敗" });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const data = await orderService.getOrderById(req.params.orderId);
    if (!data) return res.status(404).json({ error: "Order not found" });
    res.json(data);
  } catch (err) {
    console.error("取得訂單失敗：", err);
    res.status(500).json({ error: "取得訂單失敗" });
  }
});

router.get("/by-member/:memberId", async (req, res) => {
  try {
    const data = await orderService.getOrdersByMemberId(req.params.memberId);
    res.json(data);
  } catch (err) {
    console.error("取得會員訂單失敗：", err);
    res.status(500).json({ error: "取得會員訂單失敗" });
  }
});

router.post("/", async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.json({ success: true, order });
  } catch (err) {
    console.error("建立訂單失敗：", err);
    res.status(500).json({ success: false, message: err.message || "建立訂單失敗" });
  }
});

router.patch("/:orderId", async (req, res) => {
  try {
    await orderService.updateOrder(req.params.orderId, req.body || {});
    res.json({ success: true });
  } catch (err) {
    console.error("更新訂單失敗：", err);
    res.status(500).json({ success: false, message: err.message || "更新訂單失敗" });
  }
});

router.delete("/:orderId", async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.orderId);
    res.json({ success: true });
  } catch (err) {
    console.error("刪除訂單失敗：", err);
    res.status(500).json({ success: false, message: err.message || "刪除訂單失敗" });
  }
});

module.exports = router;
