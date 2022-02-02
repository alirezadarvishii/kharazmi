const { Router } = require("express");

const router = Router();

const userController = require("../controller/user.controller");
const asyncHandler = require("../middleware/asyncHandler");

// ---------------------- GET ROUTES ----------------------

// Get a user profile.
router.get("/profile/:role/:userId", userController.profile);

//TODO: NEW ROUTES SCRENARIOS.
router.post("/approve", asyncHandler(userController.approve));

router.post("/unapprove", asyncHandler(userController.unApprove));

module.exports = router;
