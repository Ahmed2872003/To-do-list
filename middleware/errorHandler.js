const { CustomAPIError } = require("../errors/customErrors.js");
const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    if (err.message)
      return res.status(err.statusCode).json({ msg: err.message });
    else return res.sendStatus(err.statusCode);
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal server error", reason: err.message });
};

module.exports = errorHandler;
