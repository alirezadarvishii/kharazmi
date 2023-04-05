const { Router } = require("express");

const router = Router();

const meController = require("../controller/me.controller");
const asyncHandler = require("../middleware/asyncHandler");
const { isAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const authValidation = require("../validation/auth.validation");

// ---------------------- GET ROUTES ----------------------

// Get user panel page
router.get("/", isAuth, asyncHandler(meController.userPanel));

// Get user edit information page.
router.get("/edit", isAuth, meController.edit);

// Get user change password page.
router.get("/change-password", isAuth, meController.changePassword);

// Get user blogs management page.
router.get("/blogs", isAuth, asyncHandler(meController.manageOwnBlogs));

// ---------------------- POST ROUTES ----------------------

// Handle user edit information.
router.post(
  "/edit/:role",
  isAuth,
  validate(authValidation.editUserValidation),
  asyncHandler(meController.handleEdit),
);

// Handle user change password
router.post(
  "/change-password",
  isAuth,
  validate(authValidation.resetPasswordValidation),
  asyncHandler(meController.handleChangePassword),
);

router.post(
  "/delete-account",
  isAuth,
  asyncHandler(meController.deleteAccount),
);

module.exports = router;
