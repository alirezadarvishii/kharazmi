const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const Blog = require("../model/blog");
const Gallery = require("../model/gallery");
const Event = require("../model/event");
const getUserByRole = require("../utils/getUserByRole");

exports.indexPage = async (req, res) => {
  const galleryImages = await Gallery.find({});
  const blogs = await Blog.find({ status: "approved" }).limit(10).populate("author");
  const teachers = await Teacher.find({ status: "approved" });
  const events = await Event.find({});
  res.render("index", {
    title: "هنرستان کاردانش خوارزمی | ناحیه فیروزآباد",
    galleryImages,
    blogs,
    teachers,
    events,
  });
};

exports.departman = async (req, res) => {
  const admins = await Admin.find({ status: "approved" }).select("-password");
  const teachers = await Teacher.find({ status: "approved" }).select("-password");
  const departman = [...admins, ...teachers];
  res.render("departman", {
    title: "اعضای دپارتمان مدرسه",
    headerTitle: "اعضای دپارتمان مدرسه",
    departman,
  });
};

exports.gallery = async (req, res) => {
  const images = await Gallery.find({});
  res.render("gallery", {
    title: "گالری وبسایت",
    headerTitle: "گالری وبسایت",
    images,
  });
};

// API
exports.getGalleryImg = async (req, res) => {
  const { imgId } = req.params;
  const img = await Gallery.findOne({ _id: imgId });
  res.status(200).json(img);
};

// API
exports.getEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOne({ _id: eventId });
  res.status(200).json(event);
};

exports.about = (req, res) => {
  res.render("about", {
    title: "درباره ما",
    headerTitle: "دربـاره مـا",
  });
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
