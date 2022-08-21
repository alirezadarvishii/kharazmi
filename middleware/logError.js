const logErrors = (req, res, next, err) => {
  console.log(err.message);
  next(err);
};

module.exports = logErrors;
