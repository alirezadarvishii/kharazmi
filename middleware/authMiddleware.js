const httpStatus = require("http-status");
const { ForbiddenError } = require("@casl/ability");

const ApiError = require("../lib/ApiError");

module.exports.isAuth = (req, res, next) => {
  if (!req.user) {
    throw new ApiError({
      code: httpStatus[401],
      statusCode: httpStatus.UNAUTHORIZED,
      message: "لطفا ابتدا وارد حساب کاربری خود شوید!",
      redirectionPath: "/",
    });
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(249).redirect("/");
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) return res.status(429).redirect("/");
  next();
};

module.exports.hasPermission = (can, model) => (req, res, next) => {
  ForbiddenError.from(req.ability).throwUnlessCan(can, model);
  next();
};
