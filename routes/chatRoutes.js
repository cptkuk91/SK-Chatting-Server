const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// 채팅 시작 (채팅방 찾기 또는 새로 만들기)
router.post("/start-chat", chatController.startChat);

// 사용자의 채팅방 목록 조회
router.get("/chat-rooms", chatController.getChatRooms);

// 특정 채팅방의 메시지 조회
router.get("/chat-rooms/:roomId/messages", chatController.getMessagesInRoom);

// 채팅방에 메시지 전송
router.post("/send-message", chatController.sendMessage);

module.exports = router;
