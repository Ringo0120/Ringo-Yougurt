const express = require("express");
const router = express.Router();
const MemberService = require("../services/memberService");

router.get("/", async (req, res) => {
  try {
    const members = await MemberService.getAllMembers();
    res.json(members);
  } catch (err) {
    console.error("取得會員清單失敗", err);
    res.status(500).json({ error: "取得會員清單資失敗" });
  }
});

router.post("/create", async (req, res) => {
  const { lineId, memberName, phone } = req.body;
  try {
    const exists = await MemberService.checkMemberExists(memberName, phone);
    if (exists) {
      return res.status(400).json({ success: false, message: "會員已存在" });
    }
    const memberId = await MemberService.createMember(lineId, memberName, phone);
    res.status(201).json({ success: true, memberId });
  } catch (err) {
    console.error("新增會員失敗", err);
    res.status(500).json({ success: false, message: "新增會員失敗" });
  }
});

router.post("/login-or-bind", async (req, res) => {
  const { lineId, displayName } = req.body;
  if (!lineId || !displayName) {
    return res.status(400).json({ success: false, message: "缺少 lineId 或 displayName" });
  }

  try {
    const existing = await MemberService.getByLineId(lineId);
    if (existing) {
      return res.status(200).json({ success: true, member: existing });
    }

    const memberId = await MemberService.createMember(lineId, displayName, "");
    const member = await MemberService.getByLineId(lineId);
    return res.status(201).json({ success: true, member });
  } catch (err) {
    console.error("登入或綁定會員失敗", err);
    res.status(500).json({ success: false, message: "處理失敗" });
  }
});

router.get("/:memberId", async (req, res) => {
  const { memberId } = req.params;
  try {
    const member = await MemberService.getMemberById(memberId);
    if (!member) return res.status(404).json({ error: "Not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/by-line/:lineId", async (req, res) => {
  const { lineId } = req.params;
  try {
    const member = await MemberService.getByLineId(lineId);
    if (!member) {
      return res.status(404).json({ success: false, message: "查無會員" });
    }
    res.json(member);
  } catch (err) {
    console.error("查詢會員失敗", err);
    res.status(500).json({ success: false });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    await MemberService.updateMember(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("更新會員失敗", err);
    res.status(500).json({ success: false });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await MemberService.deleteMember(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("刪除會員失敗", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
