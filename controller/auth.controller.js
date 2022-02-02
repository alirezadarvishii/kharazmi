const path = require("path");

const { hash, compare } = require("bcrypt");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");

const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const User = require("../model/user");
const ErrorResponse = require("../utils/ErrorResponse");
const authValidation = require("../validation/auth.validation");
const checkEmailExist = require("../utils/checkEmailExist");
const getUserByRole = require("../utils/getUserByRole");
const sendEmail = require("../utils/sendEmail");

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
  const { password } = req.body;
  // Validation Process.
  const validate = authValidation.adminValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (!req.files.profileImg) {
    throw new ErrorResponse(402, "عکس پروفایل الزامی است", "back");
  }
  const checkEmail = await checkEmailExist(req.body.email);
  if (checkEmail.includes(true)) return res.status(400).redirect("back");
  // Convert user password to hash.
  const hashPassword = await hash(password, 12);
  // Generate a name for image.
  const filename = `${Date.now()}.jpeg`;
  // Download image with sharp
  await sharp(req.files.profileImg[0].buffer)
    .jpeg({ quality: 60 })
    .toFile(path.join(__dirname, "..", "public", "users", filename));
  const adminUsersLength = await Admin.countDocuments();
  if (adminUsersLength < 1) {
    await Admin.create({
      ...req.body,
      status: "approved",
      profileImg: filename,
      password: hashPassword,
    });
  } else {
    await Admin.create({
      ...req.body,
      profileImg: filename,
      password: hashPassword,
    });
  }
  req.flash("success", "ثبت نام با موفقیت انجام شد!");
  res.redirect("/login");
};

module.exports.handleRegisterTeacher = async (req, res) => {
  const { password } = req.body;
  // Validation data.
  const validate = authValidation.teacherValidation.validate(req.body);
  // Handle validation error.
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (!req.files.profileImg) {
    throw new ErrorResponse(404, "عکس پروفایل الزامی است", "back");
  }
  // Check exist email.
  const checkEmail = await checkEmailExist(req.body.email);
  if (checkEmail.includes(true)) return res.redirect("back");
  // Convert user password to hash string.
  const hashPassword = await hash(password, 12);
  // Generate a name for image.
  const filename = `${Date.now()}.jpeg`;
  // Download image with sharp
  await sharp(req.files.profileImg[0].buffer)
    .jpeg({ quality: 60 })
    .toFile(path.join(__dirname, "..", "public", "users", filename));
  // Save new teacher to the database
  await Teacher.create({
    ...req.body,
    profileImg: filename,
    password: hashPassword,
  });
  req.flash(
    "success",
    "ثبت نام شما با موفقیت انجام شد و پس از تأیید حساب کاربری شما از سوی مدیریت، میتوانید وارد حساب خود شوید!",
  );
  res.redirect("/");
};

module.exports.handleRegisterUser = async (req, res) => {
  const { password } = req.body;
  // Validation data.
  const validate = authValidation.normalUserValidation.validate(req.body);
  // Handle validation error.
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (!req.files.profileImg) {
    throw new ErrorResponse(404, "عکس پروفایل الزامی است", "back");
  }
  const checkEmail = await checkEmailExist(req.body.email);
  if (checkEmail.includes(true)) return res.redirect("back");
  const hashPassword = await hash(password, 12);
  // Generate a name for image.
  const filename = `${Date.now()}.jpeg`;
  // Download image with sharp
  await sharp(req.files.profileImg[0].buffer)
    .jpeg({ quality: 60 })
    .toFile(path.join(__dirname, "..", "public", "users", filename));
  await User.create({
    ...req.body,
    profileImg: filename,
    password: hashPassword,
  });
  req.flash(
    "success",
    "ثبت نام شما با موفقیت انجام شد و میتوانید وارد اکانت خود شوید!",
  );
  res.redirect("/login");
};

module.exports.handleLogin = async (req, res, next) => {
  const { email, password, loginType } = req.body;
  // validation data and handle validation error if exist.
  const validate = authValidation.loginValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/login");
  }
  const user = await getUserByRole(loginType, { email });
  if (!user)
    throw new ErrorResponse(
      400,
      "ایمیل با پسوورد اشتباه است، بیشتر دقت کنید!",
      "/login",
    );
  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch)
    throw new ErrorResponse(
      400,
      "ایمیل با پسوورد اشتباه است، بیشتر دقت کنید!",
      "/login",
    );
  if (user.status !== "approved") {
    throw new ErrorResponse(
      403,
      "کاربر گرامی، حساب کاربری شما در حالت تعلیق قرار دارد و باید از سوی مدیریت تأیید شود!",
      "/",
    );
  }
  delete user._doc.password;
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
    if (err) throw new ErrorResponse(500, "Something went wrong!");
    res.redirect("/");
  });
};

module.exports.forgetPassword = (req, res) => {
  res.render("forget-password", {
    title: "فراموشی رمز عبور!",
  });
};

module.exports.handleForgetPassword = async (req, res) => {
  const { email, userType } = req.body;
  const user = await getUserByRole(userType, { email });
  if (!user)
    throw new ErrorResponse(404, "کاربری با این ایمیل یافت نشد!", "back");
  // Create user token
  const token = jwt.sign(
    {
      email: user.email,
      userRole: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" },
  );
  // Render email layout
  const resetPasswordHtml = await ejs.renderFile(
    path.join(__dirname, "..", "views", "includes", "email-reset-password.ejs"),
    { token },
  );
  // Sending email to user.
  try {
    const emailInfo = await sendEmail(
      email,
      "بازنشانی رمز عبور",
      resetPasswordHtml,
    );
    console.log(emailInfo);
    req.flash("success", "ایمیل حاوی لینک بازنشانی رمز عبور برایتان ارسال شد!");
    res.redirect("/");
  } catch (error) {
    console.log("Send email error: ", error);
    req.flash(
      "error",
      "مشکلی در ارسال ایمیل به وجود آمده است، دوباره تلاش کنید!",
    );
    res.redirect("back");
  }
};

module.exports.resetPassword = (req, res) => {
  const { token } = req.params;
  res.render("reset-password", {
    title: "تغییر رمز عبور",
    token,
  });
};

module.exports.handleResetPassword = async (req, res) => {
  let token;
  try {
    token = jwt.verify(req.body.token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    req.flash("error", "توکن نامعتبر، لطفا دوباره از ابتدا تلاش کنید!");
    res.status(422).res.redirect("/forget-password");
  }
  const { password } = req.body;
  const { email, userRole } = token;
  const user = await getUserByRole(userRole, { email });
  const hashedPassword = await hash(password, 12);
  console.log(hashedPassword);
  user.password = hashedPassword;
  await user.save();
  req.flash("success", "رمز عبور شما با موفقیت تعویض شد!");
  res.redirect("/login");
};
