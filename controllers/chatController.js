const ChatRoom = require("../models/ChatRoom");
const Chat = require("../models/Chat");

// 채팅방 찾기 또는 새로 만들기
exports.startChat = async (req, res) => {
  const { userId } = req.user._id; // 현재 로그인한 사용자 ID
  const { partnerId } = req.body; // 채팅을 시작하고자 하는 상대방 사용자 ID

  try {
    // 두 사용자 간의 존재하는 채팅방 찾기
    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [userId, partnerId] },
    });

    // 채팅방이 존재하지 않는 경우, 새로운 채팅방 생성
    if (!chatRoom) {
      chatRoom = new ChatRoom({
        participants: [userId, partnerId],
      });
      await chatRoom.save();
    }

    // 채팅방 ID와 함께 채팅방 정보 반환
    res
      .status(200)
      .json({ chatRoomId: chatRoom._id, message: "채팅방 준비됨" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 사용자의 채팅방 목록 조회
exports.getChatRooms = async (req, res) => {
  try {
    const userChatRooms = await ChatRoom.find({
      participants: { $in: [req.user._id] },
    }).populate("participants", "-password");
    res.status(200).json(userChatRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 특정 채팅방의 메시지 조회
exports.getMessagesInRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Chat.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 채팅방에 메시지 전송
exports.sendMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const newMessage = new Chat({
      roomId,
      sender: req.user._id,
      receiver: req.body.receiver, // 메시지 수신자 ID
      message,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
