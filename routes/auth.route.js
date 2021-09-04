const { Router } = require("express");

const router = Router();

const authController = require("../controller/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");
const recaptchaVerification = require("../middleware/captcha-verification");

//! ---------------------- GET ROUTES ----------------------

//? Choose the type of registering.
router.get("/register-type", authController.regiserType);

//? Get register page after choose type of registering.
router.get("/register", recaptchaVerification, authController.register);

//? Get login page for login user.
router.get("/login", authController.login);

//? Logout user.
router.get("/logout", authController.logout);

//? Forget password page
router.get("/forget-password", authController.forgetPassword);

//! ---------------------- POST ROUTES ----------------------
//? Handle register admins.
router.post("/register/admin", asyncHandler(authController.handleRegisterAdmin));

//? Handle register teachers.
router.post("/register/teacher", asyncHandler(authController.handleRegisterTeacher));

//? Handle register normal users.
router.post("/register/user", asyncHandler(authController.handleRegisterUser));

//? Login all of the user types.
router.post("/login", asyncHandler(authController.handleLogin), authController.handleRememberMe);

//? Handle forget password and send token email to user for reset his password
router.post("/forget-password", asyncHandler(authController.handleForgetPassword));

module.exports = router;
