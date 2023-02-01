const Task = require("../models/task.js");

const { StatusCodes } = require("http-status-codes");

const { createCustomError } = require("../errors/customErrors.js");
const task = require("../models/task.js");
// GET all the tasks
const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ userID: req.user.ID });
  res.status(StatusCodes.OK).send({ tasks });
};

// Create new task

const createTask = async (req, res) => {
  const allTasks = await Task.find({ userID: req.user.ID });
  if (allTasks.length) {
    console.log("iam in");
    const regex = /(?:[^A-za-z0-9]|_)+/g;
    const simpleName = req.body.name.replace(regex, "").toLowerCase();
    allTasks.forEach((task) => {
      if (task.name.replace(regex, "").toLowerCase() === simpleName)
        throw createCustomError(
          "This task is already exist",
          StatusCodes.CONFLICT
        );
    });
  }

  const task = await Task.create({ ...req.body, userID: req.user.ID });
  res.status(StatusCodes.CREATED).json({ task });
}; // Learn NodeJS // learn_NOdejs // learnnodejs

// GET single task

const getTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task)
    throw createCustomError(`No Task With id : ${id}`, StatusCodes.BAD_REQUEST);
  res.status(StatusCodes.OK).json({ task });
};

// Update a task

const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task)
    throw createCustomError(`No Task With id : ${id}`, StatusCodes.BAD_REQUEST);

  res.status(StatusCodes.OK).json({ task });
};

// DELETE a task

const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);

  if (!task)
    throw createCustomError(`No Task With id : ${id}`, StatusCodes.BAD_REQUEST);
  res.status(StatusCodes.OK).json({ task });
};

const deleteAllTasks = async (req, res, next) => {
  const { ID: userID } = req.user;
  const { deletedCount } = await Task.deleteMany({ userID });
  if (!deletedCount)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No tasks to delete" });
  res
    .status(StatusCodes.OK)
    .json({ msg: ` ${deletedCount} tasks Deleted Successfully` });
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
};
