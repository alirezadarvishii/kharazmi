const path = require("path");

const sharp = require("sharp");
const { ForbiddenError } = require("@casl/ability");

const Gallery = require("../model/gallery");
const ErrorResponse = require("../utils/errorResponse");
const galleryValidation = require("../validation/gallery.validation");

module.exports.addNewImageToGallery = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "GalleryImage");
  const { caption } = req.body;
  const validate = galleryValidation.addNewImgToGallery.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (req.files.galleryImg) {
    const filename = `${Date.now()}.jpeg`;
    await sharp(req.files.galleryImg[0].buffer)
      .jpeg({
        quality: 60,
      })
      .toFile(
        path.join(__dirname, "..", "public", "gallery", filename),
        async (err) => {
          if (err) {
            throw new ErrorResponse(
              402,
              "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!",
              "/register?type=user",
            );
          }
          await Gallery.create({ img: filename, caption });
          req.flash("success", "تصویر جدید با موفقیت به گالری افزوده شد");
          res.redirect("back");
        },
      );
  } else {
    throw new ErrorResponse(404, "تصویر رو یادت رفته آپلود کنی!", "back");
  }
};

module.exports.editGalleryImg = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("update", "GalleryImage");
  const { caption, imgId } = req.body;
  const validate = galleryValidation.editGalleryImg.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  const img = await Gallery.findOne({ _id: imgId });
  if (req.files.galleryImg) {
    await sharp(req.files.galleryImg[0].buffer)
      .jpeg({
        quality: 60,
      })
      .toFile(
        path.join(__dirname, "..", "public", "gallery", img.img),
        async (err) => {
          if (err) {
            throw new ErrorResponse(
              402,
              "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!",
              "back",
            );
          }
          img.caption = caption;
          await img.save();
          req.flash("success", "ویرایش با موفقیت انجام گردید!");
          res.redirect("back");
        },
      );
  } else {
    img.caption = caption;
    await img.save();
    req.flash("success", "ویرایش با موفقیت انجام گردید!");
    res.redirect("back");
  }
};

module.exports.deleteGalleryImg = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("delete", "GalleryImage");
  const { imgId } = req.body;
  await Gallery.deleteOne({ _id: imgId });
  req.flash("success", "تصویر مورد نظر با موفقیت حذف گردید!");
  res.redirect("back");
};
