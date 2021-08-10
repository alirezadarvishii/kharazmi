const { Router } = require("express");

const router = Router();

const asyncHandler = require("../middleware/asyncHandler");
const blogController = require("../controller/blog");
const isAuth = require("../middleware/isAuth");

router.get("/", blogController.blog);

router.get("/new", isAuth, blogController.addBlog);

router.get("/read/:blogId", asyncHandler(blogController.getBlog));

router.get("/like/:blogId", asyncHandler(blogController.likeBlog));

router.get("/delete-reply-comment/:replyId", asyncHandler(blogController.deleteReplyComment));

// API
router.get("/comment/read/:commentId", asyncHandler(blogController.readComment));

router.delete("/comment/delete/:commentId", asyncHandler(blogController.deleteComment));

router.post("/new", isAuth, asyncHandler(blogController.handleAddBlog));

router.post("/comment/add", isAuth, asyncHandler(blogController.addComment));

router.post("/comment/update", asyncHandler(blogController.updateComment));

module.exports = router;
