const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const app = express();

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

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
