const { Router } = require("express");

const router = Router();

const commentController = require("../controller/comment.controller");
const asyncHandler = require("../middleware/asyncHandler");
const isAuth = require("../middleware/isAuth");

//? Delete reply comment 
router.get("/delete-reply-comment/:replyId", asyncHandler(commentController.deleteReplyComment));

// API
//? Get a commment and return comment data into json format.
router.get("/read/:commentId", asyncHandler(commentController.readComment));

//? Add a new comment
router.post("/add", isAuth, asyncHandler(commentController.addComment));

//? Update a comment
router.post("/update", asyncHandler(commentController.updateComment));

// API
//? Delete a comment
router.delete("/delete/:commentId", asyncHandler(commentController.deleteComment));

module.exports = router;
