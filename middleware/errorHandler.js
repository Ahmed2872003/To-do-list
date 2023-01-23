const errorHandler = (err, req, res, next) => {
  const { message: errMsg, statusCode: errStat } = err;
  res.status(errStat).json({ msg: errMsg });
};

module.exports = errorHandler;
