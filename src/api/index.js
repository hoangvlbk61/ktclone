const express = require("express");

const { Router } = express;
const router = new Router();
const sessionMiddleware = require("../middleware/session-middleware"); 

const user = require("./user");
const session = require("./session");
const task = require("./task");
const taskUser = require("./task-user");
const verify = require("./verify");
const withdraw = require("./withdraw");
const file = require("./file");
const headerCors = function (req, res, next) {
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
}
router.use(sessionMiddleware);
router.use(headerCors);
user.use(headerCors);
session.use(headerCors);
task.use(headerCors);
taskUser.use(headerCors);
verify.use(headerCors);
withdraw.use(headerCors);
file.use(headerCors);

router.use("/api/users", user);
router.use("/api/task-user", taskUser);
router.use("/api/sessions", session);
router.use("/api/tasks", task);
router.use("/api/withdraw", withdraw);
router.use("/verify", verify);
router.use("/api/files", file);

router.use();

module.exports = router;
