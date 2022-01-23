const express = require("express");

const { Router } = express;
const router = new Router();

const user = require("./user");
const session = require("./session");
const task = require("./task");
const verify = require("./verify");
router.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
router.use("/api/users", user);
router.use("/api/sessions", session);
router.use("/api/tasks", task);
router.use("/verify", verify);

module.exports = router;
