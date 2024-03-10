// 샘플 코드입니다.
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // models 필드가 있어야 한다.
  // 아이디, 패스워드, 중복검사 정도만..
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
