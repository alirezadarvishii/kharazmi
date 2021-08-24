const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const getUserByRole = require("../utils/getUserByRole");

exports.approveAdmin = async (req, res) => {
  const { adminId } = req.params;
  await Admin.updateOne({ _id: adminId }, { $set: { status: "approved" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
};

exports.unApproveAdmin = async (req, res) => {
  const { adminId } = req.params;
  await Admin.updateOne({ _id: adminId }, { $set: { status: "notApproved" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
};

exports.approveTeacher = async (req, res) => {
  const { teacherId } = req.params;
  await Teacher.updateOne({ _id: teacherId }, { $set: { status: "approved" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
};

exports.unApproveTeacher = async (req, res) => {
  const { teacherId } = req.params;
  await Teacher.updateOne({ _id: teacherId }, { $set: { status: "notApproved" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
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
