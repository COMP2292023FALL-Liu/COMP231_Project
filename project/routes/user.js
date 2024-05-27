var express = require('express');
const { readFile } = require('fs');
const UserController = require('../controllers/UserController');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 处理用户登录的请求
router.post("/login", UserController.login);
// 处理用户登出的请求
router.get("/logout", UserController.logout);
// 处理添加新用户的请求
router.post("/user", UserController.addUser); 
// 处理更新用户的请求
router.put("/user/:id", UserController.updateUser);
// 处理删除用户的请求
router.delete("/user/:id", UserController.deleteUser);
// 处理获取用户列表的请求
router.get("/user", UserController.getUser);

module.exports = router;
