const path = require("path");

const sharp = require("sharp");

const Admin = require("../model/admin");
const Teacher = require("../model/teachers");
const Blog = require("../model/blog");
const Gallery = require("../model/gallery");
const schoolValidation = require("../validation/school-validation");
const ErrorResponse = require("../../NodeJS/news-with-backend/utils/errorResponse");

exports.blogChangeReleaseStatus = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId });
  if (blog.status === "approved") {
    blog.status = "notApproved";
  } else {
    blog.status = "approved";
  }
  await blog.save();
  req.flash("success", "تغییرات با موفقیت اعمال شد!");
  res.redirect("/dashboard/blogs");
};

exports.approveAdmin = async (req, res) => {
  const { adminId } = req.params;
  await Admin.updateOne({ _id: adminId }, { $set: { status: "approved" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("/dashboard/users/admins");
};

exports.unApproveAdmin = async (req, res) => {
  const { adminId } = req.params;
  await Admin.updateOne({ _id: adminId }, { $set: { status: "notApproved" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("/dashboard/users/admins");
};

exports.approveTeacher = async (req, res) => {
  const { teacherId } = req.params;
  await Teacher.updateOne({ _id: teacherId }, { $set: { status: "approved" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("/dashboard/users/teachers");
};

exports.unApproveTeacher = async (req, res) => {
  const { teacherId } = req.params;
  await Teacher.updateOne({ _id: teacherId }, { $set: { status: "notApprove" } });
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("/dashboard/users/teachers");
};

exports.addNewImageToGallery = async (req, res) => {
  const { caption } = req.body;
  const validate = schoolValidation.addNewImgToGallery.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/dashboard/gallery");
  }
  const filename = `${Date.now()}.jpeg`;
  await sharp(req.files.galleryImg[0].buffer)
    .jpeg({
      quality: 60,
    })
    .toFile(path.join(__dirname, "..", "public", "gallery", filename), async (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/register?type=user");
      }
      await Gallery.create({ img: filename, caption });
      req.flash("success", "تصویر جدید با موفقیت به گالری افزوده شد");
      res.redirect("/dashboard/gallery");
    });
};
