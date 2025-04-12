const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../errors/customErrors.js");

const tokenTimeSec = 30 * 60;
const refreshTokenTimeSec = 7 * 24 * 60 * 60;

const cookieConfig = {
  httpOnly: true,
  sameSite: "Strict",
  path: "/",
};

const tokenCookieConfig = {
  ...cookieConfig,
};

const refTokenCookieConfig = {
  ...cookieConfig,
  path: "/api/v1/auth/token",
};

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
    expiresIn: tokenTimeSec,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: refreshTokenTimeSec,
  });

  res.cookie("token", "Bearer " + token, {
    ...tokenCookieConfig,
    expires: new Date(Date.now() + tokenTimeSec * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    ...refTokenCookieConfig,
    expires: new Date(Date.now() + refreshTokenTimeSec * 1000),
  });

  res.status(StatusCodes.OK).json({ msg: "Signedin successfully" });
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken", { path: "/api/v1/auth/token" });

  res.sendStatus(StatusCodes.OK);
};

const generateNewToken = async (req, res) => {
  const { refreshToken } = req.cookies;

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
      expiresIn: tokenTimeSec,
    });

    res.cookie("token", "Bearer " + token, {
      ...tokenCookieConfig,
      expires: new Date(Date.now() + tokenTimeSec * 1000),
    });

    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    throw createCustomError("Refresh token error", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = {
  signup,
  signin,
  logout,
  generateNewToken,
};
