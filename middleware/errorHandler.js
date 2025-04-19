const { CustomAPIError } = require("../errors/customErrors.js");
const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    if (err.message)
      return res.status(err.statusCode).json({ msg: err.message });
    else return res.sendStatus(err.statusCode);
  }

  console.log(err);

  if (err.code === 11000) {
    let errMsg = "";

    if (err.message.includes("TASK_MANAGER.tasks"))
      errMsg = "This task already exists";

    return res.status(StatusCodes.CONFLICT).json({ msg: errMsg });
  }

  // Other error
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal server error", reason: err.message });
};

module.exports = errorHandler;
