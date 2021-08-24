const { Router } = require("express");

const router = Router();

const dashboardController = require("../controller/dashboard.controller");
const asyncHandler = require("../middleware/asyncHandler");
const isAuth = require("../middleware/isAuth");

//! ---------------------- GET ROUTES ----------------------

//? Get admin panel page.
router.get("/", isAuth, dashboardController.adminPanel);

//? Get admin users managment page.
router.get("/users/admins", asyncHandler(dashboardController.manageAdmins));

//? Get teacher users management page
router.get("/users/teachers", asyncHandler(dashboardController.manageTeachers));

//? Get normal users management page.
router.get("/users/normal-users", asyncHandler(dashboardController.manageNormalUsers));

//? Get blogs management page.
router.get("/blogs", asyncHandler(dashboardController.manageBlogs));

//? Get gallery images management page.
router.get("/gallery", asyncHandler(dashboardController.manageGallery));

//? Get events management page.
router.get("/events", isAuth, asyncHandler(dashboardController.manageEvents));

module.exports = router;