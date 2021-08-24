const path = require("path");

const sharp = require("sharp");

const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const Blog = require("../model/blog");
const Gallery = require("../model/gallery");
const Event = require("../model/event");
const ErrorResponse = require("../../NodeJS/news-with-backend/utils/errorResponse");
const schoolValidation = require("../validation/school-validation");
const adminValidation = require("../validation/admin-validation");
const deleteFile = require("../utils/deleteFile");
const pick = require("../utils/pick");

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
  if (req.files.galleryImg) {
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
  } else {
    throw new ErrorResponse(404, "تصویر رو یادت رفته آپلود کنی!", "/dashboard/gallery");
  }
};

// TODO: Refactorin sharp.
exports.editGalleryImg = async (req, res) => {
  const { caption, imgId } = req.body;
  const validate = schoolValidation.editGalleryImg.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/dashboard/gallery");
  }
  const img = await Gallery.findOne({ _id: imgId });
  if (req.files.galleryImg) {
    await sharp(req.files.galleryImg[0].buffer)
      .jpeg({
        quality: 60,
      })
      .toFile(path.join(__dirname, "..", "public", "gallery", img.img), async (err) => {
        if (err) {
          throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/register?type=user");
        }
        img.caption = caption;
        await img.save();
        req.flash("success", "ویرایش با موفقیت انجام گردید!");
        res.redirect("/dashboard/gallery");
      });
  } else {
    img.caption = caption;
    await img.save();
    req.flash("success", "ویرایش با موفقیت انجام گردید!");
    res.redirect("/dashboard/gallery");
  }
};

exports.deleteGalleryImg = async (req, res) => {
  const { imgId } = req.params;
  await Gallery.deleteOne({ _id: imgId });
  req.flash("success", "تصویر مورد نظر با موفقیت حذف گردید!");
  res.redirect("/dashboard/gallery");
};

exports.deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  await Blog.deleteOne({ _id: blogId });
  req.flash("success", "مقاله مورد نظر با موفقیت حذف گردید!");
  res.redirect("/dashboard/blogs");
};

exports.newEvent = async (req, res) => {
  const validate = adminValidation.eventSchema.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/dashboard/events");
  }
  if (!req.files.eventImg) {
    throw new ErrorResponse(404, "فیلد تصویر رویداد الزامی است!", "/dashboard/events");
  }
  const filename = `${Date.now()}.jpeg`;
  sharp(req.files.eventImg[0].buffer)
    .jpeg({
      quality: 40,
    })
    .toFile(path.join(__dirname, "..", "public", "events", filename), async (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/dashboard/events");
      }
      await Event.create({ ...req.body, eventImg: filename });
      req.flash("success", "رویداد جدید با موفقیت ایجاد شد!");
      res.redirect("/dashboard/events");
    });
};

exports.editEvent = async (req, res) => {
  const { eventId } = req.body;
  const validate = adminValidation.eventSchema.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(402, validate.error.message, "back");
  }
  const newValues = pick(req.body, ["title", "description", "start", "time"]);
  // if(req.files.eventImg) {}
  const event = await Event.updateOne({ _id: eventId }, { ...newValues });
  if (event.n === 0) {
    throw new ErrorResponse(404, "رویداد مورد نظر یافت نشد!", "back");
  }
  req.flash("success", "رویداد مورد نظر با موفقیت ویرایش گردید!");
  res.redirect("back");
};

exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOneAndDelete({ _id: eventId });
  console.log(event);
  if (!event) throw new ErrorResponse(404, "رویدادی با چنین مشخصاتی یافت نشد!", "/404");
  deleteFile(path.join(__dirname, "..", "public", "events", event.eventImg));
  req.flash("success", "رویداد مورد نظر با موفقیت حذف گردید!");
  res.redirect("/dashboard/events");
};