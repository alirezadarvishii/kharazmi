const AdminService = require("../services/admin.service");
const TeacherService = require("../services/teacher.service");
const UserService = require("../services/user.service");
const BlogService = require("../services/blog.service");
const ErrorResponse = require("../utils/ErrorResponse");
const authValidation = require("../validation/auth.validation");
const { changePasswordValidation } = require("../validation/auth.validation");

module.exports.userPanel = (req, res) => {
  res.render("user/me", {
    title: "پنل کاربری",
    headerTitle: "حساب کاربری",
  });
};

module.exports.edit = (req, res) => {
  res.render("user/edit", {
    title: "ویرایش اطلاعات حساب کاربری",
    headerTitle: "ویرایش اطلاعات حساب کاربری",
  });
};

module.exports.changePassword = (req, res) => {
  res.render("user/change-password", {
    title: "تغییر رمز عبور",
    headerTitle: "تغییر رمز عبور",
  });
};

module.exports.deleteAccount = async (req, res) => {
  const { user } = req;
  if (user.role === "admin") {
    await AdminService.deleteAccount(user._id);
  } else if (user.role === "teacher") {
    await TeacherService.deleteAccount(user._id);
  } else if (user.role === "user") {
    await UserService.deleteAccount(user._id);
  } else {
    throw new ErrorResponse(
      404,
      "مشکلی پیش آمده لطفا دوباره تلاش کنید!",
      "back",
    );
  }
  req.session.destroy((err) => {
    if (err) throw new ErrorResponse(500, "Something went wrong!");
    res.redirect("/");
  });
};

module.exports.handleEdit = async (req, res) => {
  const { fullname, bio } = req.body;
  const { role } = req.params;

  const validate = authValidation.editUserValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }

  // eslint-disable-next-line fp/no-let
  let user;

  const userDto = {
    fullname,
    bio,
    buffer: req.files?.profileImg[0].buffer,
  };
  if (role === "admin") {
    user = await AdminService.updateOne(req.user._id, userDto);
  } else if (role === "teacher") {
    user = await TeacherService.updateOne(req.user._id, userDto);
  } else if (role === "user") {
    user = await UserService.updateOne(req.user._id, userDto);
  }
  req.session.user = user;
  req.flash("success", "تغییرات شما با موفقیت اعمال شد!");
  res.redirect("/me");
};

module.exports.handleChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const validate = changePasswordValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (req.user.role === "admin") {
    await AdminService.changePassword(
      req.user._id,
      currentPassword,
      newPassword,
    );
  } else if (req.user.role === "teacher") {
    await TeacherService.changePassword(
      req.user._id,
      currentPassword,
      newPassword,
    );
  } else if (req.user.role === "user") {
    await UserService.changePassword(
      req.user._id,
      currentPassword,
      newPassword,
    );
  }
  req.flash("success", "عملیات با موفقیت انجام شد!");
  return res.status(200).redirect("/me");
};

module.exports.manageOwnBlogs = async (req, res) => {
  const blogs = await BlogService.getSpecificUserBlog(req.user._id);
  res.render("user/manage-blogs", {
    title: "مدیریت مقاله های من",
    headerTitle: "مدیریت مقاله های من",
    blogs,
  });
};
