const { Router } = require("express");

const router = Router();

const AdminController = require("../controller/admin");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/blog/release/:blogId", asyncHandler(AdminController.blogChangeReleaseStatus));

router.get("/users/approve-admin/:adminId", asyncHandler(AdminController.approveAdmin));

router.get("/users/unapprove-admin/:adminId", asyncHandler(AdminController.unApproveAdmin));

router.get("/users/approve-teachers/:teacherId", asyncHandler(AdminController.approveTeacher));

router.get("/users/unapprove-teachers/:teacherId", asyncHandler(AdminController.unApproveTeacher));

router.post("/gallery/new", asyncHandler(AdminController.addNewImageToGallery));

module.exports = router;
