const upload = require("../middlewares/multer");
const userModel = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ error: "Please fill all fields" });
    }
    const user = new userModel({ name, email, password });
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/app");
  } catch (error) {
    console.log(error);
    res.status(400).redirect("/register");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: "User Not Found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ error: "Invalid Credentials" });
    }
    const token = await user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true }).redirect("/app");
  } catch (error) {
    console.log(error);
    res.status(400).redirect("/");
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token").redirect("/");
  } catch (error) {
    res.status;
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
const searchUser = async (req, res) => {
  const query = req.query.q;
  try {
    const users = await userModel.find({ name: new RegExp(query, "i") });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//avatar upload
const uploadAvatar = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const removepublic = req.file.path.replace("public", "");
    user.avatar = removepublic;
    await user.save();
    res.send({ avatar: user.avatar });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { register, login, logout, getUser, uploadAvatar, searchUser };
