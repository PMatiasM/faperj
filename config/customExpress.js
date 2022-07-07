const express = require("express");
const consign = require("consign");
const cors = require("cors");
require("dotenv/config");

module.exports = () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  consign().include("./routes").into(app);

  return app;
};
