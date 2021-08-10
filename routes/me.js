const { Router } = require("express");

const router = Router();

const meController = require("../controller/me");
const asyncHandler = require("../middleware/asyncHandler");
const isAuth = require("../middleware/isAuth");

router.get("/", asyncHandler(meController.userPanel));

router.get("/edit", meController.edit);

router.get("/change-password", meController.changePassword);

router.get("/blogs", isAuth, asyncHandler(meController.manageOwnBlogs));

router.post("/edit/:role", asyncHandler(meController.handleEdit));

router.post("/change-password", asyncHandler(meController.handleChangePassword));

module.exports = router;
