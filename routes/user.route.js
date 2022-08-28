const { Router } = require("express");

const router = Router();

const userController = require("../controller/user.controller");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/profile/:role/:userId", userController.profile);

router.post("/approve", asyncHandler(userController.approve));

router.post("/unapprove", asyncHandler(userController.unApprove));

module.exports = router;
