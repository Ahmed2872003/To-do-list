const jwt = require("jsonwebtoken");

const { StatusCodes } = require("http-status-codes");

const { createCustomError } = require("../errors/customErrors.js");

const authenticationMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer "))
    throw createCustomError("No token provided", StatusCodes.UNAUTHORIZED);
  try {
    const decoded = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    req.user = {
      ID: decoded.userID,
      username: decoded.username,
    };
    next();
  } catch (error) {
    throw createCustomError("UNAUTHORIZED REQUEST", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = authenticationMiddleware;
