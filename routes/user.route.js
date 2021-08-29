const { Router } = require("express");

const router = Router();

const userController = require("../controller/user.controller");
const asyncHandler = require("../middleware/asyncHandler");

//! ---------------------- GET ROUTES ----------------------

//? Get a user profile.
router.get("/profile/:role/:userId", userController.profile);

//? Approving a new admin.
router.get("/approve-admin/:adminId", asyncHandler(userController.approveAdmin));

//? Unapproving a admin.
router.get("/unapprove-admin/:adminId", asyncHandler(userController.unApproveAdmin));

//? Approving a new teacher.
router.get("/approve-teachers/:teacherId", asyncHandler(userController.approveTeacher));

//? Unapproving a teacher.
router.get("/unapprove-teachers/:teacherId", asyncHandler(userController.unApproveTeacher));

module.exports = router;
