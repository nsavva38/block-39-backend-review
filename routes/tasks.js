const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");


// get tasks owned by user if the authentification checks out
router.get("/", authenticate, async (req, res, next) => {
  try {
    const tasks = await prisma.playlist.findMany({
      where: { ownerId: req.user.id },
    });
    res.json(tasks);
  } catch (e) {
    next(e);
  }
});


// post a new task for the logged in user
router.post("/", authenticate, async (req, res, next) => {
  
})