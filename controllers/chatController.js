const Chat = require("../models/Chat");

exports.getTwoUserChat = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    // MongoDB에서 두 사용자 간의 채팅 기록을 조회
    const messages = await Chat.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    }).sort({ createdAt: 1 }); // 오래된 메시지부터 정렬

    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .send({ message: "채팅 기록을 불러오는 데 실패했습니다.", error });
  }
};
