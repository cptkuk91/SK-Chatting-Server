const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const Chat = require("./models/Chat"); // 채팅 모델 추가

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3385",
    methods: ["GET", "POST"],
  },
});

// MongoDB 연결 설정
const mongoDBUrl = process.env.MONGODB_URL;
mongoose.connect(mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB 연결 에러:"));
db.once("open", function () {
  console.log("MongoDB에 성공적으로 연결되었습니다");
});

// 미들웨어 설정
app.use(cors({ origin: "http://localhost:3385", credentials: true }));
app.use(express.json());

// 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO 설정
io.on("connection", (socket) => {
  console.log("A user connected");

  // 클라이언트로부터 join_room 이벤트를 받았을 때 처리
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // 메시지 수신 및 브로드캐스트 로직, async 키워드 추가
  socket.on("send_message", async (data) => {
    try {
      const { roomId, message, sender } = data;
      // 데이터베이스에 메시지 저장 로직 추가
      const newMessage = new Chat({
        roomId,
        sender,
        message,
      });
      await newMessage.save();

      // 해당 채팅방의 모든 사용자에게 메시지 브로드캐스트
      io.to(roomId).emit("receive_message", data);
    } catch (error) {
      console.error("Error saving message to database:", error);
      // 오류 처리 로직을 추가할 수 있습니다.
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 서버 시작
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
