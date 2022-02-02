const { Router } = require("express");

const router = Router();

const galleryController = require("../controller/gallery.controller");
const asyncHandler = require("../middleware/asyncHandler");

// ---------------------- POST ROUTES ----------------------

// Add a new image to gallery handler.
router.post("/new", asyncHandler(galleryController.addNewImageToGallery));

// Edit a image from gallery handler.
router.post("/edit", asyncHandler(galleryController.editGalleryImg));

// Delete a image from gallery.
router.post("/delete", asyncHandler(galleryController.deleteGalleryImg));

module.exports = router;
