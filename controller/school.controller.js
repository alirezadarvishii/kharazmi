const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const Blog = require("../model/blog");
const Gallery = require("../model/gallery");
const Event = require("../model/event");
const genPagination = require("../utils/pagination");
const ErrorResponse = require("../utils/ErrorResponse");
const contactValidation = require("../validation/contact.validation");

exports.indexPage = async (req, res) => {
  const galleryImages = await Gallery.find({});
  const blogs = await Blog.find({ status: "approved" }).limit(10).populate("author");
  const teachers = await Teacher.find({ status: "approved" });
  const admins = await Admin.find({ status: "approved" });
  const departman = [...admins, ...teachers];
  const events = await Event.find({});
  res.render("index", {
    title: "هنرستان کاردانش خوارزمی | ناحیه فیروزآباد",
    galleryImages,
    blogs,
    departman,
    events,
  });
};

exports.departman = async (req, res) => {
  const { slide = 1 } = req.query;
  const DEPARTMAN_PER_PAGE = 12;
  const admins = await Admin.find({ status: "approved" }).select("-password");
  const teachers = await Teacher.find({ status: "approved" }).select("-password");
  const departman = [...admins, ...teachers];
  const startIndex = DEPARTMAN_PER_PAGE * (slide - 1);
  const endIndex = startIndex + DEPARTMAN_PER_PAGE;
  const finalyResult = departman.slice(startIndex, endIndex);
  const pagination = genPagination(DEPARTMAN_PER_PAGE, departman.length);
  res.render("departman", {
    title: "اعضای دپارتمان مدرسه",
    headerTitle: "اعضای دپارتمان مدرسه",
    departman: finalyResult,
    pagination,
    currentSlide: slide,
  });
};

exports.gallery = async (req, res) => {
  const { slide = 1 } = req.query;
  const IMAGE_PER_PAGE = 9;
  const images = await Gallery.find({})
    .skip(IMAGE_PER_PAGE * (slide - 1))
    .limit(IMAGE_PER_PAGE);
  const imagesLength = await Gallery.countDocuments({});
  const pagination = genPagination(IMAGE_PER_PAGE, imagesLength);
  res.render("gallery", {
    title: "گالری وبسایت",
    headerTitle: "گالری وبسایت",
    images,
    pagination,
    currentSlide: slide,
  });
};

// API
exports.getGalleryImg = async (req, res) => {
  const { imgId } = req.params;
  const img = await Gallery.findOne({ _id: imgId });
  res.status(200).json(img);
};

exports.about = (req, res) => {
  res.render("about", {
    title: "درباره ما",
    headerTitle: "دربـاره مـا",
  });
};

exports.handleContactUs = async (req, res) => {
  const { fullname, email, phone, subject, content } = req.body;
  const validate = contactValidation.comment.validate(req.body);
  // Validation process.
  if (validate.error) {
    throw new ErrorResponse(401, validate.error.message, "back");
  }
};
