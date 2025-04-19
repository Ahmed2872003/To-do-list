const { StatusCodes } = require("http-status-codes");
const Task = require("../models/task");
const { createCustomError } = require("../errors/customErrors.js");

module.exports = async (req, res, next) => {
  const { id: taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new createCustomError(
      "No task found with that id",
      StatusCodes.NOT_FOUND
    );
  }

  if (task.userID !== req.user.ID) {
    throw new createCustomError(
      "You aren't allowed to access that resource",
      StatusCodes.FORBIDDEN
    );
  }

  req.task = task;

  next();
};
