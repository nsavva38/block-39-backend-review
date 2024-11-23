const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");


// get tasks owned by user if the authentification checks out
router.get("/", authenticate, async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { ownerId: req.user.id },
    });
    res.json(tasks);
  } catch (e) {
    next(e);
  }
});


// post a new task for the logged in user
router.post("/", authenticate, async (req, res, next) => {
  // grab the post request parameters
  const { name } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        name,
        ownerId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
});





router.put("/:id", authenticate, async (req, res, next) => {
  console.log(`req.params:`, req.params);
  const { id } = req.params;

  try {
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!task) {
      return res.status(404).json({
        message: "Task not found."
      });
    }
    if(task.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this task"
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: +id },
      data: {
        done: true
      },
    });
    res.status(201).json(updatedTask);
  } catch (e) {
    next(e);
  }
});






router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: +id }
    });
    if (!task) {
      return res.status(404).json({
        message: "Task not found."
      });
    }
    if (task.ownerId !== req.user.id) {
      next({
        status: 403,
        message: "This is not tasked to you."
      });
    }
    await prisma.task.delete({
      where: { id: +id },
    });
    res.status(201).json({ message: "Task removed." });
  } catch (e) {
    next(e);
  }
});


