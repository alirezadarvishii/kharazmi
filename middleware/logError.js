const logger = require("../config/winston");

const logErrors = (err, req, res, next) => {
  logger.info(err.message, {
    Code: err.code,
    StatusCode: err.statusCode,
  });
  next(err);
};

module.exports = logErrors;
