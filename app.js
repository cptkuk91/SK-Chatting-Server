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
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// 서버 시작
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
