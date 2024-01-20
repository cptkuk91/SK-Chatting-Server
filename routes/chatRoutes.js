const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/:user1Id/:user2Id", chatController.getTwoUserChat);

module.exports = router;
