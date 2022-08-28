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
router.get("/read/:commentId", asyncHandler(commentController.readComment));

router.post(
  "/add",
  asyncHandler(recaptchaVerification),
  validate(commentValidation.comment),
  isAuth,
  asyncHandler(commentController.addComment),
);

router.post(
  "/update",
  validate(commentValidation.comment),
  asyncHandler(commentController.updateComment),
);

// API
router.delete("/delete", asyncHandler(commentController.deleteComment));

module.exports = router;
