const { Router } = require("express");

const router = Router();

const authController = require("../controller/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");
const recaptchaVerification = require("../middleware/captcha-verification");
const { isLoggedIn, isAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const authValidation = require("../validation/auth.validation");

// ---------------------- GET ROUTES ----------------------

// Choose the type of registering.
router.get("/register-type", isLoggedIn, authController.regiserType);

// Get register page after choose type of registering.
router.get("/register", isLoggedIn, authController.register);

// Get login page for login user.
router.get("/login", isLoggedIn, authController.login);

// Logout user.
router.get("/logout", authController.logout);

// Forget password page
router.get("/forget-password", isLoggedIn, authController.forgetPassword);

// Reset user password page
router.get("/reset-password/:token", isLoggedIn, authController.resetPassword);

router.get(
  "/active/:token",
  asyncHandler(authController.handleActiveUserAccount),
);

router.get(
  "/send-activation-email",
  asyncHandler(authController.sendActivationEmail),
);

// ---------------------- POST ROUTES ----------------------
// Handle register admins.
router.post(
  "/register/admin",
  asyncHandler(recaptchaVerification),
  isLoggedIn,
  validate(authValidation.adminValidation),
  asyncHandler(authController.handleRegisterAdmin),
);

// Handle register teachers.
router.post(
  "/register/teacher",
  asyncHandler(recaptchaVerification),
  isLoggedIn,
  validate(authValidation.teacherValidation),
  asyncHandler(authController.handleRegisterTeacher),
);

// Handle register normal users.
router.post(
  "/register/user",
  asyncHandler(recaptchaVerification),
  isLoggedIn,
  validate(authValidation.normalUserValidation),
  asyncHandler(authController.handleRegisterUser),
);

// Login all of the user types.
router.post(
  "/login",
  asyncHandler(recaptchaVerification),
  isLoggedIn,
  validate(authValidation.loginValidation),
  asyncHandler(authController.handleLogin),
  authController.handleRememberMe,
);

// Handle forget password and send token email to user for reset his password
router.post(
  "/forget-password",
  asyncHandler(recaptchaVerification),
  asyncHandler(authController.handleForgetPassword),
);

// Handle user account reset password
router.post(
  "/reset-password",
  asyncHandler(recaptchaVerification),
  validate(authValidation.resetPasswordValidation),
  asyncHandler(authController.handleResetPassword),
);

module.exports = router;
