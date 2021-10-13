const { Router } = require("express");

const router = Router();

const meController = require("../controller/me.controller");
const asyncHandler = require("../middleware/asyncHandler");
const { isAuth } = require("../middleware/authMiddleware");

//! ---------------------- GET ROUTES ----------------------

//? Get user panel page
router.get("/", asyncHandler(meController.userPanel));

//? Get user edit information page.
router.get("/edit", meController.edit);

//? Get user change password page.
router.get("/change-password", meController.changePassword);

//? Get user blogs management page.
router.get("/blogs", isAuth, asyncHandler(meController.manageOwnBlogs));

//! ---------------------- POST ROUTES ----------------------

//? Handle user edit information.
router.post("/edit/:role", asyncHandler(meController.handleEdit));

//? Handle user change password
router.post("/change-password", asyncHandler(meController.handleChangePassword));

router.post("/delete-acount", isAuth, meController.deleteAcount);

module.exports = router;
