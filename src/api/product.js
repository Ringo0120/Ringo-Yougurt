const express = require("express");
const router = express.Router();
const orderService = require("../services/orderService");

router.get("/", async (req, res) => {
  try {
    const products = await orderService.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("取得商品失敗：", err);
    res.status(500).json({ error: "取得商品失敗" });
  }
});

module.exports = router;
