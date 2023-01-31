class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function createCustomError(message, statusCode) {
  return new CustomAPIError(message, statusCode);
}

module.exports = { createCustomError  , CustomAPIError};
