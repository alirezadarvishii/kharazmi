const path = require("path");

const sharp = require("sharp");
const { hash, compare } = require("bcrypt");

const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const User = require("../model/user");
const Blog = require("../model/blog");
const ErrorResponse = require("../../NodeJS/news-with-backend/utils/errorResponse");
const authValidation = require("../validation/auth.validation");
const getUserByRole = require("../utils/getUserByRole");
const { changePasswordValidation } = require("../validation/auth.validation");

exports.userPanel = async (req, res) => {
  res.render("user/me", {
    title: "پنل کاربری",
    headerTitle: "حساب کاربری",
  });
};

exports.edit = (req, res) => {
  res.render("user/edit", {
    title: "ویرایش اطلاعات حساب کاربری",
    headerTitle: "ویرایش اطلاعات حساب کاربری",
  });
};

exports.changePassword = (req, res) => {
  res.render("user/change-password", {
    title: "تغییر رمز عبور",
    headerTitle: "تغییر رمز عبور",
  });
};

exports.deleteAccount = async (req, res) => {
  const { user } = req;
  if (user.role === "admin") {
    await Admin.deleteOne({ _id: user._id });
  } else if (user.role === "teacher") {
    await Teacher.deleteOne({ _id: user._id });
  } else if (user.role === "user") {
    await User.deleteOne({ _id: user._id });
  } else {
    throw new ErrorResponse(404, "مشکلی پیش آمده لطفا دوباره تلاش کنید!", "back");
  }
  req.session.destroy((err) => {
    if (err) throw new ErrorResponse(500, "Something went wrong!");
    res.redirect("/");
  });
};

exports.handleEdit = async (req, res) => {
  const { fullname, bio } = req.body;
  const { role } = req.params;
  const validate = authValidation.editUserValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  const user = await getUserByRole(role, { _id: req.user._id });
  if (!user) throw new ErrorResponse(402, "مشکلی پیش آمده، لطفا بعدا تلاش کنید!", "back");
  if (req.files.profileImg) {
    await sharp(req.files.profileImg[0].buffer).jpeg({ quality: 20 }).toFile(path.join(__dirname, "..", "public", "users", user.profileImg));
  }
  user.fullname = fullname;
  user.bio = bio;
  await user.save();
  req.session.user = user;
  req.flash("success", "تغییرات شما با موفقیت اعمال شد!");
  res.redirect("/me");
};

exports.handleChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { role, _id } = req.user;
  const validate = changePasswordValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  const user = await getUserByRole(role, { _id });
  if (!user) throw new ErrorResponse(402, "مشکلی پیش آمده، لطفا بعدا تلاش کنید!", "/me");
  const isMatchPassword = await compare(currentPassword, user.password);
  if (isMatchPassword) {
    const hashPassword = await hash(newPassword, 12);
    user.password = hashPassword;
    await user.save();
    req.flash("success", "عملیات با موفقیت انجام شد!");
    return res.redirect("/me");
  }
  throw new ErrorResponse(401, "رمز عبور فعلی نادرست است!", "back");
};

exports.manageOwnBlogs = async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id, status: "approved" });
  res.render("user/manage-blogs", {
    title: "مدیریت مقاله های من",
    headerTitle: "مدیریت مقاله های من",
    blogs,
  });
};
