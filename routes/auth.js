const { Router } = require("express");

const router = Router();

const authController = require("../controller/auth");
const asyncHandler = require("../middleware/asyncHandler");

//! ---------------------- GET ROUTES ----------------------

//! Route & Method => /register-type & GET
//? Choose the type of registering.
router.get("/register-type", authController.regiserType);

//! Route & Method => /register & GET
//? Get register page after choose type of registering.
router.get("/register", authController.register);

//! Route & Method => /login & GET
//? Get login page for login user.
router.get("/login", authController.login);

//! Route & Method => /logout & GET
//? Logout user.
router.get("/logout", authController.logout);

//! ---------------------- POST ROUTES ----------------------
//! Route & Method => /register/admin & POST
//? Handle register admins.
router.post("/register/admin", asyncHandler(authController.handleRegisterAdmin));

//! Route & Method => /register/teacher & POST
//? Handle register teachers.
router.post("/register/teacher", asyncHandler(authController.handleRegisterTeacher));

//! Route & Method => /register/user & POST
//? Handle register normal users.
router.post("/register/user", asyncHandler(authController.handleRegisterUser));

//! Route & Method => /login & POST
//? Login all of the user types.
router.post("/login", asyncHandler(authController.handleLogin), authController.handleRememberMe);

module.exports = router;
