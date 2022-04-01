const { Router } = require("express");
const bcrypt = require("bcrypt");
const headerMiddleware = require("../middleware/header-middleware"); 

const User = require("../persistence/users");
const Session = require("../persistence/sessions");

const sessionMiddleware = require("../middleware/session-middleware");

const router = new Router();
router.use(headerMiddleware);

router.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const user = await User.find(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(403).json({});
    }

    const sessionId = await Session.create(user.id);
    console.log("session created", email, sessionId)
    request.session.id = sessionId;
    if (user.password) delete user.password;
    response.status(201).json({ ssid: sessionId, user });
  } catch (error) {
    console.error(
      `POST session ({ email: ${request.body.email} }) >> ${error.stack})`
    );
    response.status(500).json();
  }
});

router.get("/", sessionMiddleware, (request, response) => {
  response.json({ userId: request.userId });
});

router.delete("/", async (request, response) => {
  try {
    if (request.session.id) {
      await Session.delete(request.session.id);
    }

    request.session.id = null;
    response.status(200).json();
  } catch (error) {
    console.error(`DELETE session >> ${error.stack}`);
    response.status(500).json();
  }
});

module.exports = router;
