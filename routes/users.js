const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json({ loginSuccess: false, message: "User not found." });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ loginSuccess: false, message: "Incorrect password." });
    }
    const tokenUser = await user.generateToken();
    res
      .cookie("x_auth", tokenUser.token)
      .status(200)
      .json({ loginSuccess: true, userId: tokenUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role !== 0,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.get("/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
