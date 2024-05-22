var express = require("express");
var router = express.Router();
var isAuth = require("../middlewares/isAuth");

const users = [
  
];

const chats = [
  
];

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/app", isAuth, function (req, res) {
  res.render("app", { users, chats, user: req.user });
});
router.get("/about", function (req, res) {
  res.render("about");
});
module.exports = router;
