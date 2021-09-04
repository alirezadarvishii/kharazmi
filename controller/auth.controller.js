const path = require("path");

const { hash, compare } = require("bcrypt");
const sharp = require("sharp");


const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const User = require("../model/user");
const ErrorResponse = require("../utils/ErrorResponse");
const authValidation = require("../validation/auth.validation");
const checkEmailExist = require("../utils/checkEmailExist");
const getUserByRole = require("../utils/getUserByRole");

exports.regiserType = (req, res) => {
  res.render("register-type", {
    title: "ثبت نام در وبسایت | هنرستان خوارزمی",
  });
};

exports.register = (req, res) => {
  const { type } = req.query;
  res.render("register", {
    title: "ثبت نام در وبسایت | هنرستان خوارزمی",
    registerType: type,
  });
};

exports.login = (req, res) => {
  res.render("login", {
    title: "ورود به وبسایت | هنرستان خوارزمی",
  });
};

exports.handleRegisterAdmin = async (req, res) => {
  const { password } = req.body;
  // Validation data.
  const validate = authValidation.adminValidation.validate(req.body);
  // Handle validation error.
  if (validate.error) {
    console.log(validate.error.message);
    throw new ErrorResponse(402, "عکس پروفایل الزامی است", "/register?type=admin");
  }
  if (!req.files.profileImg) {
    return res.redirect("/register?type=admin");
  }
  const checkEmail = await checkEmailExist(req.body.email);
  if (checkEmail.includes(true)) return res.redirect("/register?type=admin");
  const hashPassword = await hash(password, 12);
  const filename = `${Date.now()}.jpeg`;
  sharp(req.files.profileImg[0].buffer)
    .jpeg({
      quality: 60,
    })
    .toFile(path.join(__dirname, "..", "public", "users", filename), (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/register?type=admin");
      }
    });
  const adminUsersLength = await Admin.countDocuments();
  if (adminUsersLength < 1) {
    await Admin.create({ ...req.body, status: "approved", profileImg: filename, password: hashPassword });
  } else {
    await Admin.create({ ...req.body, profileImg: filename, password: hashPassword });
  }
  req.flash("success", "ثبت نام با موفقیت انجام شد!");
  res.redirect("/login");
};

exports.handleRegisterTeacher = async (req, res) => {
  const { password } = req.body;
  // Validation data.
  const validate = authValidation.teacherValidation.validate(req.body);
  // Handle validation error.
  if (validate.error) {
    console.log(validate.error.message);
    return res.redirect("/register?type=teacher");
  }
  if (!req.files.profileImg) {
    throw new ErrorResponse(402, "عکس پروفایل الزامی است", "/register?type=teacher");
  }
  // Check exist email.
  const checkEmail = await checkEmailExist(req.body.email);
  if (checkEmail.includes(true)) return res.redirect("/register?type=teacher");
  // Convert user password to hash string.
  const hashPassword = await hash(password, 12);
  const filename = `${Date.now()}.jpeg`;
  await sharp(req.files.profileImg[0].buffer)
    .jpeg({
      quality: 60,
    })
    .toFile(path.join(__dirname, "..", "public", "users", filename), (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/register?type=teacher");
      }
    });
  // Save new teacher to the database
  await Teacher.create({ ...req.body, profileImg: filename, password: hashPassword });
  req.flash(
    "success",
    "ثبت نام شما با موفقیت انجام شد و پس از تأیید حساب کاربری شما از سوی مدیریت، میتوانید وارد حساب خود شوید!"
  );
  res.redirect("/");
};

exports.handleRegisterUser = async (req, res) => {
  const { password } = req.body;
  // Validation data.
  const validate = authValidation.normalUserValidation.validate(req.body);
  // Handle validation error.
  if (validate.error) {
    console.log(validate.error.message);
    return res.redirect("/register?type=user");
  }
  if (!req.files.profileImg) {
    throw new ErrorResponse(402, "عکس پروفایل الزامی است", "/register?type=user");
  }
  const checkEmail = await checkEmailExist(req.body.email);
  if (checkEmail.includes(true)) return res.redirect("/register?type=users");
  const hashPassword = await hash(password, 12);
  const filename = `${Date.now()}.jpeg`;
  await sharp(req.files.profileImg[0].buffer)
    .jpeg({
      quality: 60,
    })
    .toFile(path.join(__dirname, "..", "public", "users", filename), (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/register?type=user");
      }
    });
  await User.create({ ...req.body, profileImg: filename, password: hashPassword });
  req.flash("success", "ثبت نام شما با موفقیت انجام شد و میتوانید وارد اکانت خود شوید!");
  res.redirect("/login");
};

exports.handleLogin = async (req, res, next) => {
  const { email, password, loginType } = req.body;
  // validation data and handle validation error if exist.
  const validate = authValidation.loginValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/login");
  }
  const user = await getUserByRole(loginType, { email });
  if (!user) throw new ErrorResponse(422, "ایمیل با پسوورد اشتباه است، بیشتر دقت کنید!", "/login");
  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch) throw new ErrorResponse(422, "ایمیل با پسوورد اشتباه است، بیشتر دقت کنید!", "/login");
  if (user.role !== "user" && user.status !== "approved") {
    throw new ErrorResponse(402, "کاربرگرامی، متأسفانه تاکنون حساب کاربری شما از سمت مدیریت تأیید نشده است!", "/");
  }
  delete user._doc.password;
  req.session.user = user;
  req.flash("success", "خــــوش آمــــدیــــد");
  next();
};

exports.handleRememberMe = (req, res) => {
  const { rememberme } = req.body;
  if (rememberme === "on") {
    req.session.cookie.originalMaxAge = 60 * 60 * 60 * 10000; // 15 minutes
  }
  res.redirect("/");
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw new ErrorResponse(500, "Something went wrong!");
    res.redirect("/");
  });
};

exports.forgetPassword = (req, res) => {
  res.render("forget-password", {
    title: "فراموشی رمز عبور!",
  });
};

exports.handleForgetPassword = async (req, res) => {
  const { email } = req.body;
};
