const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    // 이메일 중복 검사
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("이미 사용 중인 이메일입니다.");
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    // 새 사용자 객체 생성
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword, // 암호화된 비밀번호 저장
    });

    // 데이터베이스에 사용자 저장
    await newUser.save();

    // 응답으로 새로 생성된 사용자 정보 전송 (비밀번호 제외)
    res.status(201).send({ user: newUser.email, id: newUser._id });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).send("회원 가입 중 오류가 발생했습니다.");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

function generateToken(user) {
  const secretKey = "yourSecretKey";
  const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
    expiresIn: "1h",
  });
  return token;
}

exports.loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // 사용자를 위한 토큰 생성
    const token = generateToken(user);

    // 토큰을 응답에 포함하여 반환
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// TODO: FrontEnd에서 아래와 같이 전달 받도록 하자.
// 로그인 성공 후 응답으로 받은 데이터에서 토큰 추출
// const token = response.token;
// 로컬 스토리지에 토큰 저장
// localStorage.setItem('userToken', token);
