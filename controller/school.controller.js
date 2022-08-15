const AdminService = require("../services/admin.service");
const TeacherService = require("../services/teacher.service");
const BlogService = require("../services/blog.service");
const GalleryService = require("../services/gallery.service");
const EventService = require("../services/event.service");
const genPagination = require("../utils/pagination");
const ErrorResponse = require("../utils/ErrorResponse");
const contactValidation = require("../validation/contact.validation");

module.exports.indexPage = async (req, res) => {
  const galleryImages = await GalleryService.getImages({});
  const blogs = await BlogService.getBlogs({ status: "approved" });
  const teachers = await TeacherService.getTeachers({ status: "approved" });
  const admins = await AdminService.getAdmins({ status: "approved" });
  const departman = [...admins, ...teachers];
  const events = await EventService.getEvents();
  res.render("index", {
    title: "هنرستان کاردانش خوارزمی | ناحیه فیروزآباد",
    galleryImages,
    blogs,
    departman,
    events,
  });
};

module.exports.departman = async (req, res) => {
  const { slide = 1 } = req.query;
  const DEPARTMAN_PER_PAGE = 12;
  const admins = await AdminService.getAdmins(
    { status: "approved" },
    { projection: "-password" },
  );
  const teachers = await TeacherService.getTeachers(
    { status: "approved" },
    { projection: "-password" },
  );
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

module.exports.gallery = async (req, res) => {
  const { slide = 1 } = req.query;
  const IMAGE_PER_PAGE = 9;
  const queryOptions = {
    skip: (slide - 1) * IMAGE_PER_PAGE,
    limit: IMAGE_PER_PAGE,
  };
  const images = await GalleryService.getImages({}, queryOptions);
  const imagesLength = await GalleryService.countDocuments({});
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
module.exports.getGalleryImg = async (req, res) => {
  const { imgId } = req.params;
  const img = await GalleryService.findOne({ _id: imgId });
  res.status(200).json(img);
};

module.exports.about = (req, res) => {
  res.render("about", {
    title: "درباره ما",
    headerTitle: "دربـاره مـا",
  });
};

// TODO Complete it later
module.exports.handleContactUs = async (req, res) => {
  const { fullname, email, phone, subject, content } = req.body;
  const validate = contactValidation.comment.validate(req.body);
  // Validation process.
  if (validate.error) {
    throw new ErrorResponse(401, validate.error.message, "back");
  }
};
