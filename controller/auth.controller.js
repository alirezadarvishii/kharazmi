const httpStatus = require("http-status");

const AuthService = require("../services/auth.service");
const ApiError = require("../lib/ApiError");

module.exports.regiserType = (req, res) => {
  res.render("register-type", {
    title: "ثبت نام در وبسایت | هنرستان خوارزمی",
  });
};

module.exports.register = (req, res) => {
  const { type } = req.query;
  res.render("register", {
    title: "ثبت نام در وبسایت | هنرستان خوارزمی",
    registerType: type,
  });
};

module.exports.login = (req, res) => {
  res.render("login", {
    title: "ورود به وبسایت | هنرستان خوارزمی",
  });
};

module.exports.handleRegisterAdmin = async (req, res) => {
  if (!req.files.profileImg) {
    throw new ApiError({
      code: httpStatus[400],
      statusCode: httpStatus.BAD_REQUEST,
      message: "عکس پروفایل الزامی است!",
      redirectionPath: "back",
    });
  }
  const adminDto = {
    ...req.body,
    profileImg: req.files.profileImg[0],
  };
  await AuthService.registerAdmin(adminDto);
  req.flash("success", "ثبت نام با موفقیت انجام شد!");
  res.redirect("/login");
};

module.exports.handleRegisterTeacher = async (req, res) => {
  if (!req.files.profileImg) {
    throw new ApiError({
      code: httpStatus[400],
      statusCode: httpStatus.BAD_REQUEST,
      message: "عکس پروفایل الزامی است!",
      redirectionPath: "back",
    });
  }
  const teacherDto = {
    ...req.body,
    profileImg: req.files.profileImg[0],
  };
  await AuthService.registerTeacher(teacherDto);
  req.flash(
    "success",
    "ثبت نام شما با موفقیت انجام شد و پس از تأیید حساب کاربری شما از سوی مدیریت، میتوانید وارد حساب خود شوید!",
  );
  res.redirect("/");
};

module.exports.handleRegisterUser = async (req, res) => {
  if (!req.files.profileImg) {
    throw new ApiError({
      code: httpStatus[400],
      statusCode: httpStatus.BAD_REQUEST,
      message: "عکس پروفایل الزامی است!",
      redirectionPath: "back",
    });
  }
  const userDto = { ...req.body, profileImg: req.files.profileImg[0] };
  await AuthService.registerUser(userDto);
  req.flash(
    "success",
    "ثبت نام شما با موفقیت انجام شد و میتوانید وارد اکانت خود شوید!",
  );
  res.redirect("/login");
};

module.exports.handleLogin = async (req, res, next) => {
  const userDto = { ...req.body };
  const user = await AuthService.login(userDto);
  req.session.user = user;
  req.flash("success", "خــــوش آمــــدیــــد");
  next();
};

module.exports.handleRememberMe = (req, res) => {
  const { rememberme } = req.body;
  if (rememberme === "on") {
    req.session.cookie.originalMaxAge = 60 * 60 * 60 * 10000; // 15 minutes
  }
  res.redirect("/");
};

module.exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new ApiError({
        code: httpStatus[400],
        statusCode: httpStatus.BAD_REQUEST,
        message: "مشکلی پیش آمده است!F",
        redirectionPath: "/",
      });
    }
    res.redirect("/");
  });
};

module.exports.forgetPassword = (req, res) => {
  res.render("forget-password", {
    title: "فراموشی رمز عبور!",
  });
};

module.exports.handleForgetPassword = async (req, res) => {
  const userDto = { ...req.body };
  await AuthService.forgetPassword(userDto);
  req.flash("success", "ایمیل حاوی لینک بازنشانی رمز عبور برایتان ارسال شد!");
  res.redirect("/");
};

module.exports.resetPassword = (req, res) => {
  const { token } = req.params;
  res.render("reset-password", {
    title: "تغییر رمز عبور",
    token,
  });
};

module.exports.handleResetPassword = async (req, res) => {
  const userDto = { ...req.body };
  await AuthService.resetPassword(userDto);
  req.flash("success", "رمز عبور شما با موفقیت تعویض شد!");
  res.redirect("/login");
};
