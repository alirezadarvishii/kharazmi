const { Router } = require("express");

const router = Router();

const schoolController = require("../controller/school");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/", schoolController.indexPage);

router.get("/gallery", asyncHandler(schoolController.gallery));

router.get("/about", schoolController.about);

module.exports = router;
