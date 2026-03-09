const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");

User.hasMany(Project, { foreignKey: "owner_id" });
Project.belongsTo(User, { foreignKey: "owner_id" });

Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

module.exports = { User, Project, Task };