const { Router } = require("express");

const router = Router();

const commentController = require("../controller/comment.controller");
const asyncHandler = require("../middleware/asyncHandler");
const { isAuth } = require("../middleware/authMiddleware");
const recaptchaVerification = require("../middleware/captcha-verification");
const validate = require("../middleware/validate");
const commentValidation = require("../validation/comment.validation");

router.get("/:blogId", asyncHandler(commentController.getComments));

// API
// Get a commment and return comment data into json format.
router.get("/read/:commentId", asyncHandler(commentController.readComment));

// Add a new comment
router.post(
  "/add",
  asyncHandler(recaptchaVerification),
  validate(commentValidation.comment),
  isAuth,
  asyncHandler(commentController.addComment),
);

// Update a comment
router.post(
  "/update",
  validate(commentValidation.comment),
  asyncHandler(commentController.updateComment),
);

// API
// Delete a comment
router.delete("/delete", asyncHandler(commentController.deleteComment));

module.exports = router;
