const { Router } = require("express");
const TaskUser = require("../persistence/task-user");
const Task = require("../persistence/task");
const User = require("../persistence/users");
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
    let canAssignTasks = allTask.filter((tk) => {
      const tId = tk.task_id;
      if (tId === 0) return false;
      if (taskDoneTurn[tId] === undefined || taskDoneTurn[tId] === null)
        return true;
      return tk.max_turn > taskDoneTurn[tId];
    });
    if (canAssignTasks.length > 0) {
      canAssignTasks = canAssignTasks.sort((a, b) => b.priority - a.priority);
      if (canAssignTasks.length > 5)
        canAssignTasks = canAssignTasks.slice(0, 5);
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
    const currentTask = await TaskUser.findCurrentTask(userId);
    console.log(
      "🚀 ~ file: task-user.js ~ line 56 ~ router.get ~ taskDone",
      currentTask
    );

    if (currentTask) crTask = currentTask;
    return response.status(200).json(crTask);
  } catch (error) {
    console.error(`Task User List /current >> Error: ${error.stack}`);
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
      if (updateRes) {
        const taskData = await Task.find(taskId);
        const user = await User.findById(userId);
        if (!taskData || !user)
          return response
            .status(400)
            .json({ message: "task or user not exist" });
        const updateUserBalance = await User.update({
          ...user,
          balance: user.balance + taskData.reward,
        });
        if (updateUserBalance) return response.status(204).end();
        else
          return response
            .status(400)
            .end({ message: "update user balance failed" });
      } else
        return response.status(400).json({
          message: `Task id ${taskId} is not assigned to user ${userId}`,
        });
    } else
      return response.status(400).json({
        message: `Task id ${taskId} is not assigned to user ${userId}`,
      });
  } catch (error) {
    console.error(`Task User List /finish >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

router.delete("/:taskId", async (request, response) => {
  const userId = request.userId;
  const { taskId } = request.params;
  if (!taskId) return response.status(400).json({ message: "Missing task_id" });
  try {
    const currentTask = await TaskUser.findCurrentTask(userId, taskId);
    if (currentTask) {
      const deleteRes = await TaskUser.deleteUserTask(currentTask.id);
      console.log(
        "🚀 ~ file: task-user.js ~ line 95 ~ router.delete ~ deleteRes",
        deleteRes
      );
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
        return response.status(400).json({
          message:
            "You currently have a task, please finish or cancel it first",
        });
      else turn = lastTask.turn + 1;
    }

    const task = await TaskUser.create(userId, taskId, false, turn);

    if (!task) {
      return response.status(400).json({ message: "Task already exists" });
    }
    return response.status(201).json(task);
  } catch (error) {
    console.error(`createTask() >> Error: ${error.stack}`);
    response.status(500).json();
  }
});

module.exports = router;
