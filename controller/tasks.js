const Task = require("../models/task.js");

const { StatusCodes } = require("http-status-codes");

const { createCustomError } = require("../errors/customErrors.js");
// GET all the tasks
const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ userID: req.user.ID });
  res.status(StatusCodes.OK).send({ tasks });
};

// Create new task

const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, userID: req.user.ID });
  res.status(StatusCodes.CREATED).json({ task });
};

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

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
