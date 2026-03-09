const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const projectController = require("../controllers/projectController");

router.get("/projects", authMiddleware, projectController.getProjects);
router.post("/projects", authMiddleware, projectController.createProject);

module.exports = router;