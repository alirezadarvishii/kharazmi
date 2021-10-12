const path = require("path");

const sharp = require("sharp");
const { Types } = require("mongoose");

const Blog = require("../model/blog");
const ErrorResponse = require("../utils/ErrorResponse");
const blogValidation = require("../validation/blog.validation");
const isObjectId = require("../utils/isObjectId");
const pick = require("../utils/pick");
const genPagination = require("../utils/pagination");
const ac = require("../security/accesscontrol");

exports.blog = async (req, res) => {
  const { slide = 1 } = req.query;
  const BLOGS_PER_PAGE = 9;
  const blogs = await Blog.find({ status: "approved" })
    .populate("author")
    .skip(BLOGS_PER_PAGE * (slide - 1))
    .limit(BLOGS_PER_PAGE);
  const blogsLength = await Blog.countDocuments({ status: "approved" });
  const pagination = genPagination(BLOGS_PER_PAGE, blogsLength);
  res.render("blog/blog", {
    title: "وبلاگ هنرستان",
    headerTitle: "وبـلـاگ هنرستان",
    blogs,
    pagination,
    blogsLength,
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
  if (!blog) return res.status(400).redirect("/404");
  await Blog.populate(blog, { path: "author" });
  const otherBlogs = await Blog.find({}).limit(10);
  const isBeforeVisited = blog.visit.findIndex((ip) => ip === ip);
  if (isBeforeVisited < 0) {
    await Blog.updateOne({ _id: blogId }, { $push: { visit: ip } });
  }
  if (!blog) throw new ErrorResponse(404, "Not founded!", "/notFounded");
  res.render("blog/single-blog", {
    title: blog.title,
    blog,
    otherBlogs,
  });
};

exports.getBlogInPrivateMode = async (req, res) => {
  if (req.user.role === "admin") {
    const { blogId } = req.params;
    const blog = await Blog.findOne({ _id: blogId });
    console.log(blog);
  } else {
    res.status(403).redirect("/");
  }
};

exports.addBlog = (req, res) => {
  const permission = ac.can(req.user.role).create("blog");
  if (permission.granted) {
    res.render("blog/add-blog", {
      title: "افزودن پست جدید",
      headerTitle: "افزودن پست جدید",
    });
  } else {
    res.redirect("/");
  }
};

exports.handleAddBlog = async (req, res) => {
  const permission = ac.can(req.user.role).create("blog");
  if (permission.granted) {
    const validate = blogValidation.blog.validate(req.body);
    // Validation process.
    if (validate.error) {
      throw new ErrorResponse(422, validate.error.message, "back");
    }
    // generate a name for image.
    const filename = `${Date.now()}.jpeg`;
    // Handle download image with sharp.
    await sharp(req.files.blogImg[0].buffer)
      .jpeg({ quality: 60 })
      .toFile(path.join(__dirname, "..", "public", "blog", filename))
      .catch((err) => {
        console.log("SHARP ERROR: ", err);
        throw new ErrorResponse(422, "خطا در بارگیری تصویر!", "back");
      });
    // set author model for population author.
    const authorModel = req.user.role === "admin" ? "Admin" : "Teacher";
    const tags = req.body.tags.split("/");
    const slug = req.body.title.split(" ").join("-");
    await Blog.create({ ...req.body, slug, tags, blogImg: filename, author: req.user._id, authorModel });
    req.flash("success", "پست جدید با موفقیت ساخته شد و با تأیید نهایی از سوی مدیریت در حالت عمومی قرار میگیرد!");
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

exports.updateBlog = async (req, res) => {
  const permission = ac.can(req.user.role).updateOwn("blog");
  if (permission.granted) {
    const { blogId } = req.params;
    const blog = await Blog.findOne({ _id: blogId });
    if (blog.author.toString() === req.user._id.toString()) {
      res.render("blog/update-blog", {
        title: `ویرایش بلاگ ${blog.title}`,
        headerTitle: `ویرایش ${blog.title}`,
        blog,
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};

exports.handleUpdateBlog = async (req, res) => {
  const permission = ac.can(req.user.role).updateOwn("blog");
  if (permission.granted) {
    const { blogId } = req.body;
    const validate = blogValidation.blog.validate(req.body);
    if (validate.error) {
      throw new ErrorResponse(402, validate.error.message, "back");
    }
    const blog = await Blog.findOne({ _id: blogId });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    const newValues = pick(req.body, ["title", "category", "body"]);
    const tags = req.body.tags.split("/");
    if (req.files.blogImg) {
      await sharp(req.files.blogImg[0].buffer)
        .jpeg({
          quality: 60,
        })
        .toFile(path.join(__dirname, "..", "public", "blogs", blog.blogImg));
    }
    await Blog.updateOne({ _id: blog._id }, { ...newValues, tags });
    req.flash("success", "پست شما با موفقیت ویرایش گردید!");
    res.redirect("/me/blogs");
  } else {
    res.redirect("/");
  }
};

exports.handleDeleteBlog = async (req, res) => {
  const permission = ac.can(req.user.role).deleteOwn("blog");
  if (permission.granted) {
    const { blogId } = req.body;
    // Check that ID is valid
    if (!isObjectId(blogId)) throw new ErrorResponse(402, "Forbidden!", "back");
    const blog = await Blog.findOne({ _id: blogId });
    // If blog not found
    if (!blog) throw new ErrorResponse(404, "پست مورد نظر یافت نشد!", "back");
    // Check current user permission level.
    const fullPermission = ac.can(req.user.role).deleteAny("blog");
    if (!fullPermission.granted) {
      // If blog author not match with current user.
      if (blog.author.toString() !== req.user._id.toString()) {
        throw new ErrorResponse(403, "Forbidden!", "/");
      }
    }
    await Blog.deleteOne({ _id: blogId });
    req.flash("success", "پست مورد نظر با موفقیت حذف گردید!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};

// API: Public api for any type of users.
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

exports.approveBlog = async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("blog");
  if (permission.granted) {
    const { blogId } = req.body;
    await Blog.updateOne({ _id: blogId }, { $set: { status: "approved" } });
    req.flash("success", "تغییرات با موفقیت اعمال شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};

exports.unApproveBlog = async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("blog");
  if (permission.granted) {
    const { blogId } = req.body;
    await Blog.updateOne({ _id: blogId }, { $set: { status: "notApproved" } });
    req.flash("success", "تغییرات با موفقیت اعمال شد!");
    res.redirect("back");
  } else {
    res.redirect("/");
  }
};