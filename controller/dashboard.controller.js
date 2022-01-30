const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const User = require("../model/user");
const Blog = require("../model/blog");
const BlogCategory = require("../model/blog.categories");
const Gallery = require("../model/gallery");
const Event = require("../model/event");
const Comment = require("../model/blogs.comment");

const pick = require("../utils/pick");

exports.adminPanel = async (req, res) => {
  const notApprovedAdmins = await Admin.find({ status: "notApproved" });
  const notApprovedTeachers = await Teacher.find({ status: "notApproved" });
  const notApprovedUsers = [...notApprovedAdmins, ...notApprovedTeachers];
  // Users length informations.
  const lengthOfAdmins = await Admin.countDocuments({});
  const lengthOfTeachers = await Teacher.countDocuments({});
  const lengthOfNormalUsers = await User.countDocuments({});
  const lengthOfTotalUsers = lengthOfAdmins + lengthOfTeachers + lengthOfNormalUsers;
  // Blogs length information
  const lengthOfApprovedBlogs = await Blog.countDocuments({ status: "approved" });
  const lengthOfNotApprovedBlogs = await Blog.countDocuments({ status: "notApproved" });
  const lengthOfTotalBlogs = lengthOfApprovedBlogs + lengthOfNotApprovedBlogs;
  // Comments length information.
  const lengthOfTotalComments = await Comment.countDocuments({});
  // Waiting for approved blogs.
  const waitingForApproveBlogs = await Blog.find({ status: "notApproved" }).populate("author").limit(3);
  res.render("dashboard/admin-panel", {
    title: "پنل ادمین",
    notApprovedUsers,
    lengthOfAdmins,
    lengthOfTeachers,
    lengthOfNormalUsers,
    lengthOfTotalUsers,
    lengthOfApprovedBlogs,
    lengthOfNotApprovedBlogs,
    lengthOfTotalBlogs,
    lengthOfTotalComments,
    waitingForApproveBlogs,
  });
};

exports.manageAdmins = async (req, res) => {
  const { status, sort, q = "" } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const admins = await Admin.find({ ...filters })
    .sort(sort)
    .select("-password");
  res.render("dashboard/manage-admins", {
    title: "مدیریت ادمین های وبسایت",
    admins,
    status,
    query: q,
  });
};

exports.manageTeachers = async (req, res) => {
  const { status, sort, q = "" } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const teachers = await Teacher.find({ ...filters })
    .sort(sort)
    .select("-password");
  res.render("dashboard/manage-teachers", {
    title: "مدیریت معلم های وبسایت",
    teachers,
    status,
    query: q,
  });
};

exports.manageNormalUsers = async (req, res) => {
  const { status, sort, q = "" } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const users = await User.find({ ...filters })
    .sort(sort)
    .select("-password");
  res.render("dashboard/manage-normalusers", {
    title: "مدیریت کاربران وبسایت",
    users,
    status,
    query: q,
  });
};

exports.manageBlogs = async (req, res) => {
  const { status, q = "", sort } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const blogs = await Blog.find({ ...filters })
    .sort(sort)
    .populate("author");
  res.render("dashboard/manage-blogs", {
    title: "مدیریت بلاگ های وبسایت",
    blogs,
    query: q,
    status,
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
  const events = await Event.find({});
  res.render("dashboard/manage-events", {
    title: "مدیریت رویداد ها",
    events,
  });
};

exports.blogsSettingPage = async (req, res) => {
  const blogCategories = await BlogCategory.find({});
  res.render("dashboard/blog-settings", {
    title: "ناحیه تنظیمات بلاگ ها",
    blogCategories,
  });
};
