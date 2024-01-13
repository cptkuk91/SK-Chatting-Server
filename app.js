const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001", // 클라이언트의 URL
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");

const port = 3000;

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

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// 서버를 알리기 위함
app.use("/api", userRoutes);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
