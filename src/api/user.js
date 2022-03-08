const { Router } = require("express");
const User = require("../persistence/users");
const Withdraw = require("../persistence/withdraw");
const adminMiddleware = require("../middleware/admin-middleware");

const router = new Router();
const headerMiddleware = require("../middleware/header-middleware"); 
router.use(headerMiddleware);

router.get("", adminMiddleware, async (request, response) => {
  try {
    const users = await User.list();
    return response.status(200).json(users);
  } catch (error) {
    console.error(`Userlist >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post("", async (request, response) => {
  try {
    const { email, password, user_social_id } = request.body;
    if (!email || !password || !user_social_id) {
      return response
        .status(400)
        .json({
          message: "email and password and user_social_id must be provided",
        });
    }

    const findUserWithSId = await User.findBySocialId(user_social_id);
    if (findUserWithSId)
      return response
        .status(400)
        .json({
          message: "Social id existence. ",
          user_mail: findUserWithSId.email,
        });
    const user = await User.create(request.body);
    if (!user) {
      return response.status(400).json({ message: "User already exists" });
    }

    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.get("/:userId", adminMiddleware, async (request, response) => {
  const { userId } = request.params;
  const userIdRequester = request.userId;
  const is_admin = request.is_admin;
  if (!is_admin && userIdRequester !== userId)
    return response.status(401).json({ message: "Can not get user of others" });
  try {
    const user = await User.findById(userId);
    if (user) return response.status(200).json(user);
    else
      return response.status(404).json({ message: `user ${userId} not exist` });
  } catch (error) {
    console.error(`Userlist >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.get("/:userId/withdraw", async (request, response) => {
  const { userId } = request.params;
  const userIdRequester = request.userId;
  const is_admin = request.is_admin;
  if (!is_admin && userIdRequester !== userId)
    return response
      .status(401)
      .json({ message: "Can not get withdraw of others" });
  try {
    const { userId } = request.params;
    const withdraws = await Withdraw.getListByUser(userId);
    return response.status(200).json(withdraws);
  } catch (error) {
    console.error(`Withdraw List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post("/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    // const userId = request.userId;
    if (!userId)
      return response.status(400).json({ message: "User not exist" });
    const user = await User.update({
      ...request.body,
      id: userId,
      balance: undefined,
    });
    if (!user) {
      return response.status(400).json({ message: "Update user failed" });
    }
    if (user.password) delete user.password;
    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.delete("/:userId", adminMiddleware, async (request, response) => {
  try {
    const userId = request.userId;
    const { userId: deleteUserId } = request.params;
    if (!userId)
      return response.status(400).json({ message: "User not exist" });
    if (userId === deleteUserId)
      return response.status(400).json({ message: "Can not delete yourself" });
    const user = await User.deleteUser(deleteUserId);
    if (!user) {
      return response.status(400).json({ message: "Delete user failed" });
    }
    if (user.password) delete user.password;
    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

module.exports = router;
