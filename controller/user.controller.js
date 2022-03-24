const { ForbiddenError } = require("@casl/ability");

const AdminService = require("../services/admin.service");
const TeacherService = require("../services/teacher.service");
const UserService = require("../services/user.service");

module.exports.profile = async (req, res) => {
  const { userId, role } = req.params;
  // eslint-disable-next-line fp/no-let
  let user;
  if (role === "admin") {
    user = await AdminService.getAdmin(role, userId);
  } else if (role === "teacher") {
    user = await TeacherService.getTeacher(role, userId);
  } else if (role === "user") {
    user = await UserService.getUser(role, userId);
  }
  res.render("user/profile", {
    title: `پروفایل ${user.fullname}`,
    headerTitle: `پروفایل  ${user.fullname}`,
    user,
  });
};

module.exports.approve = async (req, res) => {
  const { role, userId } = req.body;
  ForbiddenError.from(req.ability).throwUnlessCan("approve", "User");
  if (role === "admin") {
    await AdminService.approve(userId);
  } else if (role === "teacher") {
    await TeacherService.approve(userId);
  } else if (role === "user") {
    await UserService.approve(userId);
  }
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
};

module.exports.unApprove = async (req, res) => {
  const { role, userId } = req.body;
  ForbiddenError.from(req.ability).throwUnlessCan("unApprove", "User");
  if (role === "admin") {
    await AdminService.unApprove(userId);
  } else if (role === "teacher") {
    await TeacherService.unApprove(userId);
  } else if (role === "user") {
    await UserService.unApprove(userId);
  } else {
    res.redirect("back");
  }
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
};
