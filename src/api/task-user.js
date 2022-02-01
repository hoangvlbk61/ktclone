const { Router } = require("express");
const TaskUser = require("../persistence/task-user");

const router = new Router();

router.get("", async (request, response) => {
  try {
    const task = await TaskUser.list();
    return response.status(200).json(task);
  } catch (error) {
    console.error(
      `Task User List >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.get("random", async (request, response) => {
  try {
    const taskDone = await TaskUser.listTaskDoneByUser();
    return response.status(200).json(task);
  } catch (error) {
    console.error(
      `Task User List >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.post("", async (request, response) => {
  try {
    const task = await TaskUser.create(request.body);
    if (!task) {
      return response.status(400).json({ message: "Task already exists" });
    }

    return response.status(200).json(task);
  } catch (error) {
    console.error(
      `createTask() >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

module.exports = router;
