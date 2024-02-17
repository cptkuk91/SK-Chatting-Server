const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
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
