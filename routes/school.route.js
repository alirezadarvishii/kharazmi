const { Router } = require("express");

const router = Router();

const schoolController = require("../controller/school.controller");
const asyncHandler = require("../middleware/asyncHandler");

// ---------------------- GET ROUTES ----------------------

// Get index [landing] page.
router.get("/", schoolController.indexPage);

// Get department page
router.get("/departman", asyncHandler(schoolController.departman));

// Get gallery page.
router.get("/gallery", asyncHandler(schoolController.gallery));

// API
// Get a img with description from gallery and return json data.
router.get("/gallery/img/:imgId", schoolController.getGalleryImg);

// Get about-us page.
router.get("/about", schoolController.about);

router.post("/contact", asyncHandler(schoolController.handleContactUs));

module.exports = router;
