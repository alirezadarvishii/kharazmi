const { Router } = require("express");

const router = Router();

const authController = require("../controller/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");
const recaptchaVerification = require("../middleware/captcha-verification");
const { isLoggedIn } = require("../middleware/authMiddleware");

//! ---------------------- GET ROUTES ----------------------

//? Choose the type of registering.
router.get("/register-type", isLoggedIn, authController.regiserType);

//? Get register page after choose type of registering.
router.get("/register", isLoggedIn, authController.register);

//? Get login page for login user.
router.get("/login", isLoggedIn, authController.login);

//? Logout user.
router.get("/logout", authController.logout);

//? Forget password page
router.get("/forget-password", isLoggedIn, authController.forgetPassword);

//? Reset user password page
router.get("/reset-password/:token", isLoggedIn, authController.resetPassword);

//! ---------------------- POST ROUTES ----------------------
//? Handle register admins.
router.post("/register/admin", isLoggedIn, asyncHandler(authController.handleRegisterAdmin));

//? Handle register teachers.
router.post("/register/teacher", isLoggedIn, asyncHandler(authController.handleRegisterTeacher));

//? Handle register normal users.
router.post("/register/user", isLoggedIn, asyncHandler(authController.handleRegisterUser));

//? Login all of the user types.
router.post("/login", isLoggedIn, asyncHandler(authController.handleLogin), authController.handleRememberMe);

//? Handle forget password and send token email to user for reset his password
router.post("/forget-password", asyncHandler(authController.handleForgetPassword));

//? Handle user account reset password
router.post("/reset-password", asyncHandler(authController.handleResetPassword));

module.exports = router;
