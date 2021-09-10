const ErrorResponse = require("../utils/ErrorResponse");

exports.isAuth = (req, res, next) => {
  if (!req.user) throw new ErrorResponse(422, "ابتدا وارد حساب کاربری خود شوید!", "/login");
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(249).redirect("/");
  next();
};

exports.isLoggedIn = (req, res, next) => {
  if (req.user) return res.status(429).redirect("/");
  next();
};
