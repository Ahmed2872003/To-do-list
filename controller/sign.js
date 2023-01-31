const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../errors/customErrors.js");

const signup = async (req, res) => {
  if (await User.count({ username: req.body.username }))
    throw createCustomError("That username was taken", StatusCodes.CONFLICT);

  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "Created Sucessfully" });
};

const signin = async (req, res) => {
  const { username, password } = req.body;
  const [user] = await User.find({ username, password });
  if (!user)
    throw createCustomError(
      "Check the username and password again",
      StatusCodes.NOT_FOUND
    );
  const token = jwt.sign(
    { username, userID: user._id },
    process.env.JWT_SECRET
  );
  res.status(StatusCodes.OK).json({ msg: "Signedin sucessfully", token });
};

module.exports = {
  signup,
  signin,
};
