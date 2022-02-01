const { Router } = require("express");
const TaskUser = require("../persistence/task-user");
const Task = require("../persistence/task");
const { random } = require("../utils");
const router = new Router();

router.get("", async (request, response) => {
  try {
    const task = await TaskUser.list();
    return response.status(200).json(task);
  } catch (error) {
    console.error(`Task User List >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.get("/random", async (request, response) => {
  const userId = request.userId;
  let rdTask = {};
  try {
    const taskDone = await TaskUser.listTaskDoneByUser(userId);
    const allTask = await Task.list();

    const taskDoneTurn = {};
    taskDone.forEach((tkDone) => {
      const task_id = tkDone.task_id;
      if (!taskDoneTurn[task_id]) taskDoneTurn[task_id] = 0;
      if (tkDone.status) taskDoneTurn[task_id] = taskDoneTurn[task_id] + 1;
    });
    const canAssignTasks = allTask.filter((tk) => {
      const tId = tk.task_id;
      if (tId === 0) return false;
      if (taskDoneTurn[tId] === undefined || taskDoneTurn[tId] === null)
        return true;
      return tk.max_turn > taskDoneTurn[tId];
    });
    if (canAssignTasks.length > 0) {
      const randomIdx = random(0, canAssignTasks.length);
      rdTask = canAssignTasks[randomIdx];
    }
    return response.status(200).json(rdTask);
  } catch (error) {
    console.error(`Task User List /random >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.get("/current", async (request, response) => {
  const userId = request.userId;
  let crTask = {};
  try {
    const taskDone = await TaskUser.listTaskDoneByUser(userId);
    const currentTask = taskDone.find((e) => !e.status);
    if (currentTask) crTask = currentTask;
    return response.status(200).json(crTask);
  } catch (error) {
    console.error(`Task User List /random >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.post("/finish", async (request, response) => {
  const userId = request.userId;
  const { task_id: taskId } = request.body;
  if (!taskId) return response.status(400).json({ message: "Missing task_id" });
  try {
    const currentTask = await TaskUser.findCurrentTask(userId, taskId);
    if (currentTask) {
      const updateRes = await TaskUser.updateStatusTrue(currentTask.id);
      if (updateRes) return response.status(204).end();
      else
        return response.status(400).json({
          message: `Task id ${taskId} is not assigned to user ${userId}`,
        });
    } else
      return response.status(400).json({
        message: `Task id ${taskId} is not assigned to user ${userId}`,
      });
  } catch (error) {
    console.error(`Task User List /random >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.delete("/:taskId", async (request, response) => {
  const userId = request.userId;
  const { taskId } = request.params;
  if (!taskId) return response.status(400).json({ message: "Missing task_id" });
  try {
    const currentTask = await TaskUser.findCurrentTask(userId, taskId);
    console.log("🚀 ~ file: task-user.js ~ line 91 ~ router.delete ~ currentTask", currentTask)
    if (currentTask) {
      const deleteRes = await TaskUser.deleteUserTask(currentTask.id);
      console.log("🚀 ~ file: task-user.js ~ line 95 ~ router.delete ~ deleteRes", deleteRes)
      if (deleteRes) return response.status(204).end();
      else
        return response.status(400).json({
          message: `Task id ${taskId} is not assigned to user ${userId}`,
        });
    } else
      return response.status(404).json({
        message: `Task id ${taskId} is not assigned to user ${userId}`,
      });
  } catch (error) {
    console.error(`Task User List /random >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

// Assign a task
router.post("", async (request, response) => {
  const userId = request.userId;
  const { task_id: taskId } = request.body;
  if (!taskId) return response.status(400).json({ message: "Missing task_id" });
  try {
    let turn = 1;
    const lastTask = await TaskUser.getLastUserTaskByUser(userId);
    if (lastTask) {
      if (!lastTask.status)
        return response
          .status(400)
          .json({
            message: "You currently have a task, please finish or cancel it first",
          });
      else turn = lastTask.turn + 1;
    }

    const task = await TaskUser.create(userId, taskId, false, turn);

    if (!task) {
      return response.status(400).json({ message: "Task already exists" });
    }
  } catch (error) {
    console.error(`createTask() >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

module.exports = router;
