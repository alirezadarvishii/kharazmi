const path = require("path");

const sharp = require("sharp");
const { Types } = require("mongoose");

const Blog = require("../model/blog");
const Comment = require("../model/comment");
const ErrorResponse = require("../utils/ErrorResponse");
const blogValidation = require("../validation/blog.validation");
const isObjectId = require("../utils/isObjectId");
const pick = require("../utils/pick");
const genPagination = require("../utils/pagination");

exports.blog = async (req, res) => {
  const { slide = 1 } = req.query;
  const BLOGS_PER_PAGE = 9;
  const blogs = await Blog.find({ status: "approved" })
    .populate("author")
    .skip(BLOGS_PER_PAGE * (slide - 1))
    .limit(BLOGS_PER_PAGE);
  const blogsLength = await Blog.countDocuments({});
  const pagination = genPagination(BLOGS_PER_PAGE, blogsLength);
  res.render("blog/blog", {
    title: "وبلاگ هنرستان",
    headerTitle: "وبـلـاگ هنرستان",
    blogs,
    pagination,
    currentSlide: slide,
  });
};

exports.getBlog = async (req, res) => {
  const { blogId } = req.params;
  const { ip } = req;
  const userId = Types.ObjectId(req.user?._id);
  const [blog] = await Blog.aggregate([
    { $match: { _id: Types.ObjectId(blogId), status: "approved" } },
    {
      $addFields: {
        isLiked: {
          $cond: {
            if: { $gte: [{ $indexOfArray: ["$likes", userId] }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);
  await Blog.populate(blog, { path: "author" });
  // const comments = await Comment.find({ blog: blogId }).populate("user replies.user").sort("-createdAt");
  const otherBlogs = await Blog.find({}).limit(10);
  const isBeforeVisited = blog.visit.findIndex((ip) => ip === ip);
  if (isBeforeVisited < 0) {
    await Blog.updateOne({ _id: blogId }, { $push: { visit: ip } });
  }
  if (!blog) throw new ErrorResponse(404, "Not founded!", "/notFounded");
  res.render("blog/single-blog", {
    title: blog.title,
    blog,
    comments: [],
    otherBlogs,
  });
};

exports.addBlog = (req, res) => {
  res.render("blog/add-blog", {
    title: "افزودن پست جدید",
    headerTitle: "افزودن پست جدید",
  });
};

exports.handleAddBlog = async (req, res) => {
  const validate = blogValidation.blog.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/blog/new");
  }
  const filename = `${Date.now()}.jpeg`;
  sharp(req.files.blogImg[0].buffer)
    .jpeg({
      quality: 60,
    })
    .toFile(path.join(__dirname, "..", "public", "blogs", filename), async (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/blog/new");
      }
      // set author model for population author.
      const authorModel = req.user.role === "admin" ? "Admin" : "Teacher";
      const tags = req.body.tags.split("/");
      const slug = req.body.title.split(" ").join("-");
      const shortId = Math.floor(Math.random() * 99999);
      await Blog.create({ ...req.body, slug, shortId, tags, blogImg: filename, author: req.user._id, authorModel });
      req.flash("success", "پست جدید با موفقیت ساخته شد و با تأیید نهایی از سوی مدیریت در حالت عمومی قرار میگیرد!");
      res.redirect("/");
    });
};

exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId });
  res.render("blog/update-blog", {
    title: `ویرایش بلاگ ${blog.title}`,
    headerTitle: `ویرایش ${blog.title}`,
    blog,
  });
};

exports.handleUpdateBlog = async (req, res) => {
  const { blogId } = req.body;
  const validate = blogValidation.blog.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(402, validate.error.message, "back");
  }
  const blog = await Blog.findOne({ _id: blogId });
  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(403, "Forbidden!", "/");
  }
  const newValues = pick(req.body, ["title", "category", "body"]);
  const tags = req.body.tags.split("/");
  if (req.files.blogImg) {
    sharp(req.files.blogImg[0].buffer)
      .jpeg({
        quality: 60,
      })
      .toFile(path.join(__dirname, "..", "public", "blogs", blog.blogImg), async (err) => {
        if (err) {
          throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/blog/new");
        }
        await Blog.updateOne({ _id: blog._id }, { ...newValues, tags });
        req.flash("success", "پست شما با موفقیت ویرایش گردید!");
        return res.redirect("/me/blogs");
      });
  }
  await Blog.updateOne({ _id: blog._id }, { ...newValues, tags });
  req.flash("success", "پست شما با موفقیت ویرایش گردید!");
  res.redirect("/me/blogs");
};

exports.handleDeleteBlog = async (req, res) => {
  const { blogId } = req.body;
  // Check that ID is valid
  if (!isObjectId(blogId)) throw new ErrorResponse(402, "Forbidden!", "back");
  const blog = await Blog.findOne({ _id: blogId });
  // If blog not found
  if (!blog) throw new ErrorResponse(404, "پست مورد نظر یافت نشد!", "back");
  // If blog author not match with user session
  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(403, "Forbidden!", "/");
  }
  await Blog.deleteOne({ _id: blogId });
  req.flash("success", "پست مورد نظر با موفقیت حذف گردید!");
  res.redirect("back");
};

// API
exports.likeBlog = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Authentication ERROR!" });
  const { blogId } = req.params;
  const { _id } = req.user;
  const blog = await Blog.findOne({ _id: blogId });
  const isLiked = blog.likes.includes(_id);
  if (!isLiked) {
    blog.likes.push(_id);
  } else {
    const likes = blog.likes.filter((like) => like.toString() !== _id.toString());
    blog.likes = [...likes];
  }
  await blog.save();
  res.status(200).json({ blogLikesLength: blog.likes.length, message: "Operation completed successfuly!" });
};

exports.blogChangeReleaseStatus = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId });
  if (blog.status === "approved") {
    blog.status = "notApproved";
  } else {
    blog.status = "approved";
  }
  await blog.save();
  req.flash("success", "تغییرات با موفقیت اعمال شد!");
  res.redirect("back");
};
