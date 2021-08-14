const { Router } = require("express");

const router = Router();

const dashboardController = require("../controller/dashboard");
const asyncHandler = require("../middleware/asyncHandler");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, dashboardController.adminPanel);

router.get("/users/admins", asyncHandler(dashboardController.manageAdmins));

router.get("/users/teachers", asyncHandler(dashboardController.manageTeachers));

router.get("/users/normal-users", asyncHandler(dashboardController.manageNormalUsers));

router.get("/blogs", asyncHandler(dashboardController.manageBlogs));

router.get("/gallery", asyncHandler(dashboardController.manageGallery));

router.get("/events", isAuth, asyncHandler(dashboardController.manageEvents));

module.exports = router;