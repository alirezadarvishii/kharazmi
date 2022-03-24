const AdminService = require("../services/admin.service");
const TeacherService = require("../services/teacher.service");
const UserService = require("../services/user.service");
const BlogService = require("../services/blog.service");
const CategoryService = require("../services/category.service");
const GalleryService = require("../services/gallery.service");
const EventService = require("../services/event.service");
const CommentService = require("../services/comment.service");

const pick = require("../utils/pick");

module.exports.adminPanel = async (req, res) => {
  const notApprovedAdmins = await AdminService.find({ status: "notApproved" });
  const notApprovedTeachers = await TeacherService.find({
    status: "notApproved",
  });
  const notApprovedUsers = [...notApprovedAdmins, ...notApprovedTeachers];
  // Users length informations.
  const lengthOfAdmins = await AdminService.countDocuments({});
  const lengthOfTeachers = await TeacherService.countDocuments({});
  const lengthOfNormalUsers = await UserService.countDocuments({});
  const lengthOfTotalUsers =
    lengthOfAdmins + lengthOfTeachers + lengthOfNormalUsers;
  // Blogs length information
  const lengthOfApprovedBlogs = await BlogService.countDocuments({
    status: "approved",
  });
  const lengthOfNotApprovedBlogs = await BlogService.countDocuments({
    status: "notApproved",
  });
  const lengthOfTotalBlogs = lengthOfApprovedBlogs + lengthOfNotApprovedBlogs;
  // Comments length information.
  const lengthOfTotalComments = await CommentService.countDocuments({});
  // Waiting for approved blogs.
  const waitingForApproveBlogs = await BlogService.find(
    {
      status: "notApproved",
    },
    { limit: 3 },
  );
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

module.exports.manageAdmins = async (req, res) => {
  const { status, sort, q = "" } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const admins = await AdminService.find({ ...filters })
    .sort(sort)
    .select("-password");
  res.render("dashboard/manage-admins", {
    title: "مدیریت ادمین های وبسایت",
    admins,
    status,
    query: q,
    sort,
  });
};

module.exports.manageTeachers = async (req, res) => {
  const { status, sort, q = "" } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const teachers = await TeacherService.find({ ...filters })
    .sort(sort)
    .select("-password");
  res.render("dashboard/manage-teachers", {
    title: "مدیریت معلم های وبسایت",
    teachers,
    status,
    query: q,
    sort,
  });
};

module.exports.manageNormalUsers = async (req, res) => {
  const { status, sort, q = "" } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const users = await UserService.find({ ...filters })
    .sort(sort)
    .select("-password");
  res.render("dashboard/manage-normalusers", {
    title: "مدیریت کاربران وبسایت",
    users,
    status,
    query: q,
    sort,
  });
};

module.exports.manageBlogs = async (req, res) => {
  const { status, q = "", sort = "-createdAt" } = req.query;
  const filters = pick(req.query, ["status"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const blogs = await BlogService.find({ ...filters })
    .sort(sort)
    .populate("author");
  res.render("dashboard/manage-blogs", {
    title: "مدیریت بلاگ های وبسایت",
    blogs,
    query: q,
    status,
    sort,
  });
};

module.exports.manageGallery = async (req, res) => {
  const images = await GalleryService.find({});
  res.render("dashboard/manage-gallery.ejs", {
    title: "مدیریت گالری وبسایت",
    images,
  });
};

module.exports.manageEvents = async (req, res) => {
  const events = await EventService.find({});
  res.render("dashboard/manage-events", {
    title: "مدیریت رویداد ها",
    events,
  });
};

module.exports.blogsSettingPage = async (req, res) => {
  const blogCategories = await CategoryService.find({});
  res.render("dashboard/blog-settings", {
    title: "ناحیه تنظیمات بلاگ ها",
    blogCategories,
  });
};
