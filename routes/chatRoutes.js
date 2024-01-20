const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/:user1Id/:user2Id", chatController.getTwoUserChat); // 1 대 1 채팅
// 모두가 모이는 채팅
// 랜덤 채팅

module.exports = router;
