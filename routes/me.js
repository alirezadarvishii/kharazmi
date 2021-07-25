const { Router } = require("express");

const router = Router();

const meController = require("../controller/me");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/", asyncHandler(meController.userPanel));

router.get("/edit", meController.edit);

router.get("/change-password", meController.changePassword);

router.post("/edit/:role", asyncHandler(meController.handleEdit));

router.post("/change-password", asyncHandler(meController.handleChangePassword));

module.exports = router;
