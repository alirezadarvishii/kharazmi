const logErrors = (err, req, res, next) => {
  console.log("Message: ", err.message);
  console.log("Code:", err.code);
  console.log("Status Code:  ", err.statusCode);
  next(err);
};

module.exports = logErrors;
