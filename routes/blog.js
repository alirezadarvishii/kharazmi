const { Router } = require("express");

const router = Router();

const asyncHandler = require("../middleware/asyncHandler");
const blogController = require("../controller/blog");
const isAuth = require("../middleware/isAuth");

router.get("/", blogController.blog);

router.get("/new", isAuth, blogController.addBlog);

router.get("/:blogId", asyncHandler(blogController.getBlog));

router.post("/new", isAuth, asyncHandler(blogController.handleAddBlog));

module.exports = router;
