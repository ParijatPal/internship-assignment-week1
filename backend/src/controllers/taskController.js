const { Task } = require("../models");

// GET tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    await Task.update(req.body, { where: { id } });

    res.json({ message: "Task updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await Task.destroy({ where: { id } });

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};