const userFunc = require("../function/user");
const express = require("express");
var validate = require("../function/validate");
var constants = require("../lib/constant");
const router = express.Router();

// 1.Get all users
router.get("/user", async function (req, res) {
  userFunc.getUser(req, res);
});

// 2.Get user detail by id
router.get("/user/:userId", function (req, res) {
  userFunc.getUserById(req, res);
});

// 3.Create user
router.post("/user", function (req, res) {
  userFunc.createUser(req, res);
});

// 4.Update user by id
router.put("/user/:userId", function (req, res) {
  console.log('data req update : ',req.body);
  userFunc.updateUser(req, res);
});

// 5.Delete user by id
router.delete("/user/:userId", function (req, res) {
  userFunc.deleteUser(req, res);
});

router.get("/getDataAndPaging", function (req, res) {
  userFunc.getAllUser(req, res);
});



module.exports = router;
