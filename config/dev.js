// dev.js

require("dotenv").config();
const db_id = process.env.DB_ID;
const db_pw = process.env.DB_PW;
const db_cluster = process.env.DB_CLUSTER;

module.exports = {
  mongoURI: `mongodb+srv://${db_id}:${db_pw}@${db_cluster}.hjbajnr.mongodb.net/?retryWrites=true&w=majority&appName=${db_cluster}`,
};
