const express = require("express");

const { Router } = express;
const router = new Router();
const apiRouter = new Router();
const sessionMiddleware = require("../middleware/session-middleware"); 

const user = require("./user");
const session = require("./session");
const task = require("./task");
const taskUser = require("./task-user");
const verify = require("./verify");
const withdraw = require("./withdraw");
const file = require("./file");



router.use(sessionMiddleware);
const mdlCors = function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://mfast.asia");
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
};
router.use(mdlCors);
apiRouter.use("/api/users", user);
apiRouter.use("/api/task-user", taskUser);
apiRouter.use("/api/sessions", session);
apiRouter.use("/api/tasks", task);
apiRouter.use("/api/withdraw", withdraw);
apiRouter.use("/api/files", file);
router.use("/verify", verify);
router.use("/api", apiRouter);
apiRouter.use(mdlCors);

module.exports = router;
