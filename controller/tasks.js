const Task = require("../models/task.js");

const asyncWrapper = require("../middleware/asyncWrapper.js");

const createCustomError = require("../errors/customErrors.js");
// GET all the tasks
const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).send({ tasks });
});

// Create new task

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

// GET single task

const getTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return next(createCustomError(`No Task With id : ${id}`, 404));
  res.status(200).json({ task });
});

// Update a task

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) return next(createCustomError(`No Task With id : ${id}`, 404));

  res.status(200).json({ task });
});

// DELETE a task

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);

  if (!task) return next(createCustomError(`No Task With id : ${id}`, 404));

  res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
