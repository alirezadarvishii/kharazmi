const { Router } = require("express");

const router = Router();

const commentController = require("../controller/comment.controller");
const asyncHandler = require("../middleware/asyncHandler");
const { isAuth } = require("../middleware/authMiddleware");
const recaptchaVerification = require("../middleware/captcha-verification");

router.get("/:blogId", asyncHandler(commentController.getComments))

// API
//? Get a commment and return comment data into json format.
router.get("/read/:commentId", asyncHandler(commentController.readComment));

//? Add a new comment
// TODO: add recaptcha verification to this route
router.post("/add", isAuth, asyncHandler(commentController.addComment));

//? Update a comment
router.post("/update", asyncHandler(commentController.updateComment));

// API
//? Delete a comment
router.delete("/delete", asyncHandler(commentController.deleteComment));

module.exports = router;
