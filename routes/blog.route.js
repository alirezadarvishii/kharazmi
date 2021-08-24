const { Router } = require("express");

const router = Router();

const asyncHandler = require("../middleware/asyncHandler");
const blogController = require("../controller/blog.controller");
const isAuth = require("../middleware/isAuth");

//! ---------------------- GET ROUTES ----------------------

//? Route and Method: /blog & GET
router.get("/", blogController.blog);

//? Route and Method: /blog/new & GET
router.get("/new", isAuth, blogController.addBlog);

//? Accept a new blog for publishing into website weblog
router.get("/blog/release/:blogId", asyncHandler(blogController.blogChangeReleaseStatus));

//? Route and Method: /blog/read/:blogId & GET
router.get("/read/:blogId", asyncHandler(blogController.getBlog));

//? Route and Method: /blog/update/:blogId & GET
router.get("/update/:blogId", asyncHandler(blogController.updateBlog));

//? Route and Method: /blog/like/:blogId & GET
router.get("/like/:blogId", asyncHandler(blogController.likeBlog));

//? Route and Method: /blog/delete/:blogId & GET
router.get("/delete/:blogId", asyncHandler(blogController.handleDeleteBlog));

//! ---------------------- POST ROUTES ----------------------

//? Route and Method: /blog/new & POST
router.post("/new", isAuth, asyncHandler(blogController.handleAddBlog));

//? Route and Method: /blog/update & POST
router.post("/update", asyncHandler(blogController.handleUpdateBlog));

module.exports = router;
