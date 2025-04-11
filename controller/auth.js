const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../errors/customErrors.js");

const tokenTime = "1d";
const refreshTokenTime = "7d";

const signup = async (req, res) => {
  if (await User.count({ username: req.body.username }))
    throw createCustomError("That username was taken", StatusCodes.CONFLICT);

  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "Created successfully" });
};

const signin = async (req, res) => {
  const { username, password } = req.body;
  const [user] = await User.find({ username });
  if (!user)
    throw createCustomError("User doesn't exist", StatusCodes.NOT_FOUND);

  if (password !== user.password)
    throw createCustomError("Wrong password", StatusCodes.UNAUTHORIZED);

  const payload = { username, userID: user._id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: tokenTime,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: refreshTokenTime,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Signedin successfully", token, refreshToken });
};

const generateNewToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    throw new createCustomError(
      "Refresh token error: Refresh token is not provided",
      StatusCodes.UNAUTHORIZED
    );

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    delete payload["iat"];
    delete payload["exp"];

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: tokenTime,
    });

    res.status(200).json({ token });
  } catch (err) {
    throw createCustomError("Refresh token error", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = {
  signup,
  signin,
  generateNewToken,
};
