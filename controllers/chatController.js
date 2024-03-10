const ChatRoom = require("../models/ChatRoom");
const Chat = require("../models/Chat");

// 채팅방 찾기 또는 새로 만들기
exports.startChat = async (req, res) => {
  try {
    console.log(`서버 시작 채팅`, req.body);
    // 토큰 검증을 제거하고 userId 직접 가져오기
    const userId = req.body.userId; // 요청에서 직접 사용자 ID를 받음

    const { partnerId } = req.body; // 채팅을 시작하고자 하는 상대방 사용자 ID
    console.log(`서버 상대방 아이디`, partnerId);

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
    console.log(chatRoom._id);

    // 채팅방 ID와 함께 채팅방 정보 반환
    res
      .status(200)
      .json({ chatRoomId: chatRoom._id, message: "채팅방 준비됨" });
  } catch (error) {
    console.error(error); // 에러 로깅 추가
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
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: "채팅방을 찾을 수 없습니다." });
    }

    const newMessage = new Chat({
      roomId,
      sender: req.user._id, // 메시지 보낸 사람
      message,
    });
    await newMessage.save();

    // 새로운 메시지를 해당 채팅방의 모든 참가자에게 브로드캐스트
    // 이 부분은 서버 설정에서 io 인스턴스에 접근해야 합니다.
    // 예제에서는 간소화를 위해 io 변수가 전역으로 사용 가능하다고 가정합니다.
    io.to(roomId).emit("new message", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
