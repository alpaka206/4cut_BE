const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const userRoutes = require("./routes/users");
const frameRoutes = require("./routes/frame");
const path = require("path");
// const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

// // 'uploads' 폴더가 존재하지 않으면 생성
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

app.use("/api/users", userRoutes);
app.use("/api/frame", frameRoutes);

module.exports = app;
