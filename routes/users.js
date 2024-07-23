const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        role: "ROLE_TEMP",
      });
      await user.save();
    } else {
      // 이미 가입된 유저라면 리프레시 토큰 업데이트
      await user.generateRefreshToken();
    }

    const tokenUser = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();
    res
      .cookie("x_auth", tokenUser.token, {
        httpOnly: true,
        secure: false, // 개발 환경에서는 false, 프로덕션 환경에서는 true
        sameSite: "Lax",
      })
      .cookie("x_refresh", refreshToken, {
        httpOnly: true,
        secure: false, // 개발 환경에서는 false, 프로덕션 환경에서는 true
        sameSite: "Lax",
      })
      .status(200)
      .json({
        loginSuccess: true,
        userId: tokenUser._id,
        role: user.role,
        token: tokenUser.token,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/register-nickname", auth, async (req, res) => {
  try {
    const { nickname } = req.body;
    const user = req.user;

    if (!nickname) {
      return res.status(400).json({ error: "닉네임을 입력해주세요." });
    }

    user.nickname = nickname;
    user.role = "ROLE_USER";
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/check-nickname", async (req, res) => {
  try {
    const { nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({ error: "닉네임을 입력해주세요." });
    }

    const existingUser = await User.findOne({ nickname: nickname });
    if (existingUser) {
      return res.status(400).json({ error: "이미 사용 중인 닉네임입니다." });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role !== "ROLE_TEMP",
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    nickname: req.user.nickname,
    role: req.user.role,
  });
});

router.get("/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "", refreshToken: "" }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.x_refresh;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token not found" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_TOKEN);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newToken = await user.generateToken();
    res
      .cookie("x_auth", newToken.token, {
        httpOnly: true,
        secure: false, // 개발 환경에서는 false, 프로덕션 환경에서는 true
        sameSite: "Lax",
      })
      .status(200)
      .json({ success: true });
  } catch (err) {
    console.error("리프레시 토큰 처리 중 오류 발생:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
