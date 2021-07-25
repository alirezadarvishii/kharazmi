const ErrorResponse = require("../utils/ErrorResponse");

module.exports = (req, res, next) => {
  if (!req.user) throw new ErrorResponse(422, "ابتدا وارد حساب کاربری خود شوید!", "/");
  next();
};
