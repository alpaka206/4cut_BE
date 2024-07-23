const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/users");
const frameRoutes = require("./routes/frame");

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin);
  },
  credentials: true, // 자격 증명을 허용
  optionsSuccessStatus: 200, // 일부 브라우저에서 프리플라이트 요청 오류를 방지
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/frame", frameRoutes);

module.exports = app;
