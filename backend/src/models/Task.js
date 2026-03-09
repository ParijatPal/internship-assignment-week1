const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM("Todo", "In Progress", "Done"),
    defaultValue: "Todo"
  },
  due_date: {
    type: DataTypes.DATE
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Projects",
      key: "id"
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      fields: ["project_id"]
    }
  ]
});

module.exports = Task;