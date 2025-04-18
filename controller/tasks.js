const Task = require("../models/task.js");

const { publicEncryption, privateDecryption } = require("../utils/crypto");

const { StatusCodes } = require("http-status-codes");

const { createCustomError } = require("../errors/customErrors.js");

const getAllTasks = async (req, res) => {
  const clientPbKey = Buffer.from(req.body.publicKey, "base64").toString(
    "utf-8"
  );

  let tasks = await Task.find({ userID: req.user.ID });

  encryptedTasks = tasks
    .map((task) => task.toObject())
    .map((task) => ({
      ...task,
      name: publicEncryption(clientPbKey, Buffer.from(task.name, "utf-8")),
    }));

  res.status(StatusCodes.OK).send({ tasks: encryptedTasks });
};

const createTask = async (req, res) => {
  req.body.name = privateDecryption(
    process.env.SERVER_PRIVATE_KEY,
    Buffer.from(req.body.name, "base64")
  );

  console.log(req.body);

  await Task.create({ ...req.body, userID: req.user.ID });

  res.sendStatus(StatusCodes.CREATED);
};

const getTask = async (req, res, next) => {
  const clientPbKey = Buffer.from(req.body.publicKey, "base64").toString(
    "utf-8"
  );

  const { id } = req.params;

  let task = await Task.findById(id);

  if (!task)
    throw createCustomError(`No Task With id : ${id}`, StatusCodes.BAD_REQUEST);

  task = task.toObject();

  encryptedTask = {
    ...task,
    name: publicEncryption(clientPbKey, Buffer.from(task.name, "utf-8")),
  };

  res.status(StatusCodes.OK).json({ task: encryptedTask });
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task)
    throw createCustomError(`No Task With id : ${id}`, StatusCodes.BAD_REQUEST);

  req.body.name = privateDecryption(
    process.env.SERVER_PRIVATE_KEY,
    Buffer.from(req.body.name, "base64")
  );

  Object.assign(task, req.body);

  await task.save();

  res.sendStatus(StatusCodes.OK);
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findOneAndDelete(id);

  if (!task)
    throw createCustomError(`No Task With id : ${id}`, StatusCodes.BAD_REQUEST);

  res.sendStatus(StatusCodes.OK);
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
