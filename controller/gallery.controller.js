const { ForbiddenError } = require("@casl/ability");

const GalleryService = require("../services/gallery.service");

module.exports.addNewImageToGallery = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "GalleryImage");
  const imgDto = {
    buffer: req.files.galleryImg[0].buffer,
    caption: req.body.caption,
  };
  await GalleryService.addNewImg(imgDto);
  req.flash("success", "تصویر جدید با موفقیت به گالری افزوده شد");
  res.redirect("back");
};

module.exports.editGalleryImg = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("update", "GalleryImage");
  const { caption, imgId } = req.body;
  const imgDto = {
    caption,
    img: req.files.galleryImg[0].buffer,
  };
  await GalleryService.editImg(imgId, imgDto);
  req.flash("success", "ویرایش با موفقیت انجام گردید!");
  res.redirect("back");
};

module.exports.deleteGalleryImg = async (req, res) => {
  const { imgId } = req.body;
  ForbiddenError.from(req.ability).throwUnlessCan("delete", "GalleryImage");
  await GalleryService.deleteImg(imgId);
  req.flash("success", "تصویر مورد نظر با موفقیت حذف گردید!");
  res.redirect("back");
};
