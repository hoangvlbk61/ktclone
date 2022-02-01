const { Router } = require("express");
const Task = require("../persistence/task");

const router = new Router();

router.get("", async (request, response) => {
  try {
    const users = await Task.list();
    return response.status(200).json(users);
  } catch (error) {
    console.error(`Task List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post("", async (request, response) => {
  try {
    const { name, reward, max_turn } = request.body;
    Object.keys({name, reward, max_turn}).forEach((key) => {
      if(typeof request.body[key] === "undefined") {
        return response.status(400).json({ message: `Missing ${key}` });
      }
    })
    const task = await Task.create(request.body);
    if (!task) {
      return response.status(400).json({ message: "Task already exists" });
    }

    return response.status(200).json(task);
  } catch (error) {
    console.error(`createTask() >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

module.exports = router;
