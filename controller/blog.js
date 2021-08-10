const path = require("path");

const sharp = require("sharp");
const { Types } = require("mongoose");

const Blog = require("../model/blog");
const Comment = require("../model/comment");
const ErrorResponse = require("../utils/ErrorResponse");
const blogValidation = require("../validation/blog-validation");

exports.blog = async (req, res) => {
  const blogs = await Blog.find({ status: "approved" }).populate("author");
  res.render("blog/blog", {
    title: "وبلاگ هنرستان",
    headerTitle: "وبـلـاگ مـدرسـه",
    blogs,
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
  const comments = await Comment.find({ blog: blogId }).populate("user replies.user").sort("-createdAt");
  const otherBlogs = await Blog.find({}).limit(10);
  const isBeforeVisited = blog.visit.findIndex((ip) => ip === ip);
  if (isBeforeVisited < 0) {
    await Blog.updateOne({ _id: blogId }, { $push: { visit: ip } });
  }
  if (!blog) throw new ErrorResponse(404, "Not founded!", "/notFounded");
  res.render("blog/single-blog", {
    title: blog.title,
    blog,
    comments,
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
  const validate = blogValidation.addNewPost.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/blog/new");
  }
  const filename = `${Date.now()}.jpeg`;
  await sharp(req.files.blogImg[0].buffer)
    .jpeg({
      quality: 60,
    })
    .toFile(path.join(__dirname, "..", "public", "blogs", filename), (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/blog/new");
      }
    });
  // set author model for population author.
  const authorModel = req.user.role === "admin" ? "Admin" : "Teacher";
  const tags = req.body.tags.split("/");
  await Blog.create({ ...req.body, tags, blogImg: filename, author: req.user._id, authorModel });
  req.flash("success", "پست جدید با موفقیت ساخته شد و با تأیید نهایی از سوی مدیریت در حالت عمومی قرار میگیرد!");
  res.redirect("/");
};

// Like and Dislike Blog API
exports.likeBlog = async (req, res) => {
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

exports.addComment = async (req, res) => {
  const { comment: commentBody, blogId, replyId } = req.body;
  const { user } = req;
  const validate = blogValidation.comment.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, `/blog/read/${blogId}`);
  }
  let userModel;
  if (user.role === "admin") {
    userModel = "Admin";
  } else if (user.role === "teacher") {
    userModel = "Teacher";
  } else if (user.role === "user") {
    userModel = "User";
  }
  const blog = await Blog.findOne({ _id: blogId });
  if (!replyId) {
    await Comment.create({ comment: commentBody, user: user._id, blog: blog._id, userModel });
  } else {
    const comment = await Comment.findOne({ _id: replyId });
    const replyDoc = {
      comment: commentBody,
      userModel,
      user: user._id,
    };
    comment.replies.push(replyDoc);
    await comment.save();
  }
  req.flash("success", "کامنت شما با موفقیت درج شد!");
  res.redirect(`/blog/read/${blogId}`);
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const user = req.user._id;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) return res.status(404).json({ message: "Comment not founded!" });
  if (comment.user.toString() !== user.toString()) return res.status(402).json({ message: "Forbidden!" });
  await comment.delete();
  res.status(200).json({ message: "کامنت مورد نظر با موفقیت حذف گردید!" });
};

exports.deleteReplyComment = async (req, res) => {
  const { replyId } = req.params;
  const parentCm = await Comment.findOne({ "replies._id": replyId });
  const replyIndex = parentCm.replies.findIndex((cm) => cm._id.toString() === replyId.toString());
  if (parentCm.replies[replyIndex].user.toString() === req.user._id.toString()) {
    parentCm.replies.splice(replyIndex, 1);
    await parentCm.save();
  } else {
    return res.status(402).json({ message: "Forbidden!" });
  }
  res.status(200).json({ message: "کامنت حذف گردید!" });
};

// API
exports.readComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) return res.status(404).json({ message: "Comment not founded!" });
  if (req.user._id.toString() !== comment.user.toString()) return res.status(402).json({ message: "Forbidden!" });
  res.status(200).json({ message: "Get comment successful!", comment });
};

exports.updateComment = async (req, res) => {
  const { blogId, commentId, comment: commentBody } = req.body;
  const validate = blogValidation.comment.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, `/blog/read/${blogId}`);
  }
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) throw new ErrorResponse(422, "مشکلی پیش آمده، لطفا بعدا دوباره تلاش کنید!", `/blog/read/${blogId}`);
  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(402, "Forbidden!", `/blog/read/${blogId}`);
  }
  // Update comment body.
  comment.comment = commentBody;
  await comment.save();
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect(`/blog/read/${blogId}`);
};
