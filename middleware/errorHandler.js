const { CustomAPIError } = require("../errors/customErrors.js");
const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal server error", reason: err.message });
};

module.exports = errorHandler;
