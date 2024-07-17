const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const secretToken = "secretToken";

const userSchema = new mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: true },
  password: { type: String, minlength: 5 },
  lastname: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 },
  // image: String,
  token: { type: String },
  tokenExp: { type: Number },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id.toHexString() }, secretToken);
  this.token = token;
  await this.save();
  return this;
};

userSchema.statics.findByToken = async function (token) {
  const user = this;
  try {
    const decoded = jwt.verify(token, secretToken);
    return await user.findOne({ _id: decoded._id, token: token });
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
