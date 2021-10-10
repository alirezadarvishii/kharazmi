const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const User = require("../model/user");
const getUserByRole = require("../utils/getUserByRole");
const ac = require("../security/accesscontrol");

exports.profile = async (req, res) => {
  const { userId, role } = req.params;
  const user = await getUserByRole(role, { _id: userId });
  res.render("user/profile", {
    title: `پروفایل ${user.fullname}`,
    headerTitle: `پروفایل  ${user.fullname}`,
    user,
  });
};

exports.approve = async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("user");
  const { role, userId } = req.body;
  if (permission.granted) {
    if (role === "admin") {
      await Admin.updateOne({ _id: userId }, { $set: { status: "approved" } });
    } else if (role === "teacher") {
      await Teacher.updateOne({ _id: userId }, { $set: { status: "approved" } });
    } else if (role === "user") {
      await User.updateOne({ _id: userId }, { $set: { status: "approved" } });
    }
    req.flash("success", "عملیات با موفقیت انجام شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};

exports.unApprove = async (req, res) => {
  const { role, userId } = req.body;
  const permission = ac.can(req.user.role).updateAny("user");
  if (permission.granted) {
    if (role === "admin") {
      await Admin.updateOne({ _id: userId }, { $set: { status: "notApproved" } });
    } else if (role === "teacher") {
      await Teacher.updateOne({ _id: userId }, { $set: { status: "notApproved" } });
    } else if (role === "user") {
      await User.updateOne({ _id: userId }, { $set: { status: "notApproved" } });
    } else {
      res.redirect("back");
    }
    req.flash("success", "عملیات با موفقیت انجام شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};
