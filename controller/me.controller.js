const httpStatus = require("http-status");

const AdminService = require("../services/admin.service");
const TeacherService = require("../services/teacher.service");
const UserService = require("../services/user.service");
const BlogService = require("../services/blog.service");
const ApiError = require("../lib/ApiError");

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
  }
  req.session.destroy((err) => {
    if (err) {
      throw new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        code: httpStatus[400],
        message: "مشکلی پیش آمده است!",
        redirectionPath: "/",
      });
    }
    res.redirect("/");
  });
};

module.exports.handleEdit = async (req, res) => {
  const { fullname, bio } = req.body;
  const { role } = req.params;

  // eslint-disable-next-line fp/no-let
  let user;
  const userDto = {
    fullname,
    bio,
    buffer: req.files.profileImg ? req.files.profileImg[0].buffer : undefined,
  };
  if (role === "admin") {
    user = await AdminService.updateProfile(req.user._id, userDto);
  } else if (role === "teacher") {
    user = await TeacherService.updateProfile(req.user._id, userDto);
  } else if (role === "user") {
    user = await UserService.updateProfile(req.user._id, userDto);
  }
  req.session.user = user;
  req.flash("success", "تغییرات شما با موفقیت اعمال شد!");
  res.redirect("/me");
};

module.exports.handleChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
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
  const blogs = await BlogService.getBlogs({ author: req.user._id });
  res.render("user/manage-blogs", {
    title: "مدیریت مقاله های من",
    headerTitle: "مدیریت مقاله های من",
    blogs,
  });
};
