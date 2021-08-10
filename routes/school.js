const { Router } = require("express");

const router = Router();

const schoolController = require("../controller/school");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/", schoolController.indexPage);

router.get("/departman", asyncHandler(schoolController.departman));

router.get("/gallery", asyncHandler(schoolController.gallery));

// API
router.get("/gallery/img/:imgId", schoolController.getGalleryImg);

router.get("/about", schoolController.about);

router.get("/profile/:role/:userId", schoolController.profile);

module.exports = router;
