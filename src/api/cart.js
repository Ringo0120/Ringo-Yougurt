const express = require("express");
const router = express.Router();

const fakeCartDB = {
  "member-123": {
    items: [
      { productId: "P001", name: "優格杯", price: 60, quantity: 2 },
      { productId: "P002", name: "草莓優格", price: 80, quantity: 1 },
    ],
  },
};

router.get("/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const cart = fakeCartDB[memberId] || { items: [] };
    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error("取得購物車失敗:", err);
    res.status(500).json({ error: "取得購物車失敗" });
  }
});

router.post("/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const { productId, name, price, quantity } = req.body;

    if (!fakeCartDB[memberId]) fakeCartDB[memberId] = { items: [] };
    fakeCartDB[memberId].items.push({ productId, name, price, quantity });

    res.json({ success: true, cart: fakeCartDB[memberId] });
  } catch (err) {
    console.error("更新購物車失敗:", err);
    res.status(500).json({ error: "更新購物車失敗" });
  }
});

module.exports = router;
