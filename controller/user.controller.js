const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const getUserByRole = require("../utils/getUserByRole");
const ac = require("../security/accesscontrol");

exports.approveAdmin = async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("user");
  if (permission.granted) {
    const { adminId } = req.params;
    await Admin.updateOne({ _id: adminId }, { $set: { status: "approved" } });
    req.flash("success", "عملیات با موفقیت انجام شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};

exports.unApproveAdmin = async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("user");
  if (permission.granted) {
    const { adminId } = req.params;
    await Admin.updateOne({ _id: adminId }, { $set: { status: "notApproved" } });
    req.flash("success", "عملیات با موفقیت انجام شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};

exports.approveTeacher = async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("user");
  if (permission.granted) {
    const { teacherId } = req.params;
    await Teacher.updateOne({ _id: teacherId }, { $set: { status: "approved" } });
    req.flash("success", "عملیات با موفقیت انجام شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};

exports.unApproveTeacher = async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("user");
  if (permission.granted) {
    const { teacherId } = req.params;
    await Teacher.updateOne({ _id: teacherId }, { $set: { status: "notApproved" } });
    req.flash("success", "عملیات با موفقیت انجام شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};

exports.profile = async (req, res) => {
  const { userId, role } = req.params;
  const user = await getUserByRole(role, { _id: userId });
  res.render("user/profile", {
    title: `پروفایل ${user.fullname}`,
    headerTitle: `پروفایل  ${user.fullname}`,
    user,
  });
};
