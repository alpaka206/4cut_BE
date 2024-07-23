const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, trim: true, unique: true },
  name: { type: String, required: true },
  nickname: { type: String, maxlength: 50 },
  role: { type: String, default: "ROLE_TEMP" }, // 기본값은 ROLE_TEMP
  token: { type: String },
  tokenExp: { type: Number },
  refreshToken: { type: String }, // 리프레시 토큰 필드 추가
});

userSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toHexString() },
    process.env.SECRET_TOKEN,
    { expiresIn: "1h" }
  );
  this.token = token;
  await this.save();
  return this;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = jwt.sign(
    { _id: this._id.toHexString() },
    process.env.SECRET_TOKEN,
    { expiresIn: "7d" }
  );
  this.refreshToken = refreshToken;
  await this.save();
  return this.refreshToken;
};

userSchema.statics.findByToken = async function (token) {
  const user = this;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    return await user.findOne({ _id: decoded._id, token: token });
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
