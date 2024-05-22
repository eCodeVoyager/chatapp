var express = require("express");
var router = express.Router();
var isAuth = require("../middlewares/isAuth");
const {
  register,
  login,
  logout,
  uploadAvatar,
  searchUser,
} = require("../controllers/userController");

const upload = require("../middlewares/multer");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Backend is working");
});

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuth, logout);
router.post("/upload-avatar", isAuth, upload.single("avatar"), uploadAvatar);
router.get("/search", isAuth, searchUser);

module.exports = router;
