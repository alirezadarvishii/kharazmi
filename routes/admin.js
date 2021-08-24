const { Router } = require("express");

const router = Router();

const adminController = require("../controller/admin");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/blog/release/:blogId", asyncHandler(adminController.blogChangeReleaseStatus));

router.get("/users/approve-admin/:adminId", asyncHandler(adminController.approveAdmin));

router.get("/users/unapprove-admin/:adminId", asyncHandler(adminController.unApproveAdmin));

router.get("/users/approve-teachers/:teacherId", asyncHandler(adminController.approveTeacher));

router.get("/users/unapprove-teachers/:teacherId", asyncHandler(adminController.unApproveTeacher));

router.get("/blog/delete/:blogId", asyncHandler(adminController.deleteBlog));

router.get("/gallery/delete/:imgId", asyncHandler(adminController.deleteGalleryImg));

router.post("/event/new", asyncHandler(adminController.newEvent));

router.post("/event/edit", asyncHandler(adminController.editEvent));

router.get("/event/delete/:eventId", asyncHandler(adminController.deleteEvent));

router.post("/gallery/new", asyncHandler(adminController.addNewImageToGallery));

router.post("/gallery/edit", asyncHandler(adminController.editGalleryImg));

module.exports = router;
