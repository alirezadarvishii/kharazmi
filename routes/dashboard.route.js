const { Router } = require("express");

const router = Router();

const dashboardController = require("../controller/dashboard.controller");
const asyncHandler = require("../middleware/asyncHandler");
const { isAuth, isAdmin } = require("../middleware/authMiddleware");

//! ---------------------- GET ROUTES ----------------------

//? Get admin panel page.
router.get("/", isAuth, isAdmin, dashboardController.adminPanel);

//? Get admin users managment page.
router.get("/users/admins", isAuth, isAdmin, asyncHandler(dashboardController.manageAdmins));

//? Get teacher users management page
router.get("/users/teachers", isAuth, isAdmin, asyncHandler(dashboardController.manageTeachers));

//? Get normal users management page.
router.get("/users/normal-users", isAuth, isAdmin, asyncHandler(dashboardController.manageNormalUsers));

//? Get blogs management page.
router.get("/blogs", isAuth, isAdmin, asyncHandler(dashboardController.manageBlogs));

//? Get gallery images management page.
router.get("/gallery", isAuth, isAdmin, asyncHandler(dashboardController.manageGallery));

//? Get events management page.
router.get("/events", isAuth, isAdmin, asyncHandler(dashboardController.manageEvents));

module.exports = router;
