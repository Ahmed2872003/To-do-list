const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const Task = require("../models/task.js");
const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../errors/customErrors.js");

const signup = async (req, res) => {
  if (await User.count({ username: req.body.username }))
    throw createCustomError("That username was taken", StatusCodes.CONFLICT);

  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "Created successfully" });
};

const signin = async (req, res) => {
  const { username, password } = req.body;
  const [user] = await User.find({ username, password });
  if (!user)
    throw createCustomError("User doesn't exist", StatusCodes.NOT_FOUND);
  const token = jwt.sign(
    { username, userID: user._id },
    process.env.JWT_SECRET
  );
  res.status(StatusCodes.OK).json({ msg: "Signedin successfully", token });
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
  signup,
  signin,
  deleteUser,
};
