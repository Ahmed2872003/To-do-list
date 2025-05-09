const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const Task = require("../models/task.js");
const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../errors/customErrors.js");

const getUser = async (req, res) => {
  const user = await User.findById(req.user.ID);

  if (!user)
    throw createCustomError(
      `No user with ID: ${req.user.ID}`,
      StatusCodes.NOT_FOUND
    );

  res.status(StatusCodes.OK).json({ username: user.username });
};

const deleteUser = async (req, res) => {
  if (!(await User.findByIdAndDelete(req.user.ID)))
    throw createCustomError(
      `No user with ID: ${req.user.ID}`,
      StatusCodes.NOT_FOUND
    );
  await Task.deleteMany({ userID: req.user.ID });
  res.status(StatusCodes.OK).json({ msg: "Deleted successfully" });
};

module.exports = {
  deleteUser,
  getUser,
};
