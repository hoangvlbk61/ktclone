const { Router } = require("express");
const adminMiddleware = require("../middleware/admin-middleware");

const Task = require("../persistence/task");

const router = new Router();

router.get("", adminMiddleware, async (request, response) => {
  try {
    const users = await Task.list();
    return response.status(200).json(users);
  } catch (error) {
    console.error(`Task List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.get("/:taskId", async (request, response) => {

  const { taskId } = request.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) return response.status(404).json({message: "task not exist"});

    return response.status(200).json(task);
  } catch (error) {
    console.error(`Task detail >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post("/:taskId", adminMiddleware, async (request, response) => {
  const { taskId } = request.params;
  try {
    const task = await Task.update({...request.body, id: taskId});
    if (!task) return response.status(404).json({message: "task not exist"});
    return response.status(200).json(task);
  } catch (error) {
    console.error(`Task update >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.delete("/:taskId", adminMiddleware, async (request, response) => {
  try {
    const { taskId } = request.params;
    if (!taskId)
      return response.status(400).json({ message: "Task not exist" });
    const task = await Task.delete(taskId);
    if (!task) {
      return response.status(400).json({ message: "Delete task failed" });
    }
    return response.status(200).json(task);
  } catch (error) {
    console.error(
      `Delete task failed >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.post("", adminMiddleware, async (request, response) => {
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
