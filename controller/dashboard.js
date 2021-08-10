const Admin = require("../model/admin");
const Teacher = require("../model/teachers");
const User = require("../model/user");
const Blog = require("../model/blog");
const Gallery = require("../model/gallery");

exports.adminPanel = async (req, res) => {
  const notApprovedAdmins = await Admin.find({ status: "notApproved" });
  const notApprovedTeachers = await Teacher.find({ status: "notApproved" });
  const notApprovedUsers = [...notApprovedAdmins, ...notApprovedTeachers];
  res.render("dashboard/admin-panel", {
    title: "پنل ادمین",
    notApprovedUsers,
  });
};

exports.manageAdmins = async (req, res) => {
  const admins = await Admin.find({}).select("-password");
  res.render("dashboard/manage-admins", {
    title: "مدیریت ادمین های وبسایت",
    admins,
  });
};

exports.manageTeachers = async (req, res) => {
  const teachers = await Teacher.find({}).select("-password");
  res.render("dashboard/manage-teachers", {
    title: "مدیریت معلم های وبسایت",
    teachers,
  });
};

exports.manageNormalUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.render("dashboard/manage-normalusers", {
    title: "مدیریت کاربران وبسایت",
    users,
  });
};

exports.manageBlogs = async (req, res) => {
  const blogs = await Blog.find({}).populate("author");
  res.render("dashboard/manage-blogs", {
    title: "مدیریت بلاگ های وبسایت",
    blogs,
  });
};

exports.manageGallery = async (req, res) => {
  const images = await Gallery.find({});
  res.render("dashboard/manage-gallery.ejs", {
    title: "مدیریت گالری وبسایت",
    images,
  });
};

exports.manageEvents = async (req, res) => {
  res.render("dashboard/manage-events", {
    title: "مدیریت رویداد ها",
  });
};
