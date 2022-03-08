const express = require("express");

const { Router } = express;
const router = new Router();
const sessionMiddleware = require("../middleware/session-middleware"); 
const headerMiddleware = require("../middleware/header-middleware"); 

const user = require("./user");
const session = require("./session");
const task = require("./task");
const taskUser = require("./task-user");
const verify = require("./verify");
const withdraw = require("./withdraw");
const file = require("./file");



router.use(sessionMiddleware);
router.use(headerMiddleware);
router.use("/api/users", user);
router.use("/api/task-user", taskUser);
router.use("/api/sessions", session);
router.use("/api/tasks", task);
router.use("/api/withdraw", withdraw);
router.use("/api/files", file);
router.use("/verify", verify);

module.exports = router;
