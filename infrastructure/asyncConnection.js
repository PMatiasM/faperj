const mysql = require("mysql2/promise");
require("dotenv/config");

module.exports = async () => {
  const db = await mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    dateStrings: true,
  });
  return db;
};
