const Teacher = require("../model/teachers");
const Blog = require("../model/blog");
const Gallery = require("../model/gallery");
const getUserByRole = require("../utils/getUserByRole");

exports.indexPage = async (req, res) => {
  const galleryImages = await Gallery.find({});
  const blogs = await Blog.find({ status: "approved" }).limit(10).populate("author");
  const teachers = await Teacher.find({ status: "approved" });
  res.render("index", {
    title: "هنرستان کاردانش خوارزمی | ناحیه فیروزآباد",
    galleryImages,
    blogs,
    teachers,
  });
};

exports.departman = async (req, res) => {
  res.render("departman", {
    title: "اعضای دپارتمان مدرسه",
    headerTitle: "اعضای دپارتمان مدرسه",
  });
};

exports.gallery = async (req, res) => {
  res.render("gallery", {
    title: "گالری وبسایت",
    headerTitle: "گالری وبسایت",
  });
};

// API
exports.getGalleryImg = async (req, res) => {
  console.log(req.params);
  const { imgId } = req.params;
  const img = await Gallery.findOne({ _id: imgId });
  console.log(img);
  res.status(200).json(img);
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
