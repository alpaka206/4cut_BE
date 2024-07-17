// dev.js

require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;

module.exports = {
  mongoURI: MONGO_URI,
};
