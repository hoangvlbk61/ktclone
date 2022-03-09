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
router.use("/users", user);
router.use("/task-user", taskUser);
router.use("/sessions", session);
router.use("/tasks", task);
router.use("/withdraw", withdraw);
router.use("/files", file);
router.use("/verify", verify);

module.exports = router;
