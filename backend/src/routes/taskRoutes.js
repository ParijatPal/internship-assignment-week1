const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

// GET all tasks
router.get("/tasks", authMiddleware, taskController.getTasks);

// Create task
router.post("/tasks", authMiddleware, taskController.createTask);

// Update task
router.put("/tasks/:id", authMiddleware, taskController.updateTask);

// Delete task
router.delete("/tasks/:id", authMiddleware, taskController.deleteTask);

module.exports = router;