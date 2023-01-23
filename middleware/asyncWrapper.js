const createCustomError = require("../errors/customErrors.js");
const asyncWrapper = (conFn) => {
  return async (req, res, next) => {
    try {
      await conFn(req, res, next);
    } catch (error) {
      next(createCustomError(error.message, 500));
    }
  };
};

module.exports = asyncWrapper;
