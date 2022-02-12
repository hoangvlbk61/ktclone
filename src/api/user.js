const { Router } = require("express");
const User = require("../persistence/users");

const router = new Router();

router.get("", async (request, response) => {
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
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "email and password must be provided" });
    }

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
router.patch("/:userId", async (request, response) => {
  try {
    const {userId} = request.params;
    // const userId = request.userId;
    if (!userId)
      return response.status(400).json({ message: "User not exist" });
    const user = await User.update({...request.body, id: userId});
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

router.delete("/:userId", async (request, response) => {
  try {
    const userId = request.userId;
    const { deleteUserId } = request.params;
    if (!userId)
      return response.status(400).json({ message: "User not exist" });
    if (userId === deleteUserId)
      return response.status(400).json({ message: "Can not delete yourself" });
    const user = await User.update(request.body);
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

module.exports = router;
