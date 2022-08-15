const { Router } = require("express");

const router = Router();

const galleryController = require("../controller/gallery.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const galleryValidation = require("../validation/gallery.validation");

// ---------------------- POST ROUTES ----------------------

// Add a new image to gallery handler.
router.post(
  "/new",
  validate(galleryValidation.addNewImgToGallery),
  asyncHandler(galleryController.addNewImageToGallery),
);

// Edit a image from gallery handler.
router.post(
  "/edit",
  validate(galleryValidation.editGalleryImg),
  asyncHandler(galleryController.editGalleryImg),
);

// Delete a image from gallery.
router.post("/delete", asyncHandler(galleryController.deleteGalleryImg));

module.exports = router;
