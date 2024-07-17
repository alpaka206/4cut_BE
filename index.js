const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const userRoutes = require("./routes/users");
const frameRoutes = require("./routes/frame");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/frame", frameRoutes);

app.get("/", (req, res) => {
  res.send("Hesllo World");
});

module.exports = app;
