const jwt = require("jsonwebtoken");

const { StatusCodes } = require("http-status-codes");

const { createCustomError } = require("../errors/customErrors.js");

const authenticationMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token || !token.startsWith("Bearer "))
    throw createCustomError(
      "Token error: No token provided",
      StatusCodes.UNAUTHORIZED
    );
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = {
      ID: decoded.userID,
      username: decoded.username,
    };
    next();
  } catch (error) {
    throw createCustomError("Token error", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = authenticationMiddleware;
