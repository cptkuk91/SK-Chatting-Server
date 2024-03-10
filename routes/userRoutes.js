const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// TODO: api경로명 변경하기
router.post("/user", userController.createUser);
// localhost:3000/api/user
router.get("/users", userController.getAllUsers);
router.post("/login", userController.loginUser);

module.exports = router;
