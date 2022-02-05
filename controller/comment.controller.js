const path = require("path");

const ejs = require("ejs");
const { ForbiddenError } = require("@casl/ability");

const Blog = require("../model/blog");
const Comment = require("../model/blogs.comment");
const ErrorResponse = require("../utils/errorResponse");
const commentValidation = require("../validation/comment.validation");
const { moment } = require("../utils/moment");
const { momentTime } = require("../utils/moment");

module.exports.getComments = async (req, res) => {
  const { blogId } = req.params;
  const { slide = 1 } = req.query;
  const COMMENT_PER_PAGE = 10;
  const comments = await Comment.find({ blog: blogId })
    .sort({ createdAt: "desc" })
    .populate("user replies.user")
    .limit(slide * COMMENT_PER_PAGE);
  const commentsUI = await ejs.renderFile(
    path.join(__dirname, "..", "views", "includes", "comments.ejs"),
    {
      comments,
      moment,
      momentTime,
      user: req.user,
    },
  );
  const commentsLength = await Comment.countDocuments({ blog: blogId });
  res
    .status(200)
    .json({ commentsUI, commentsLength, commentsPerPage: COMMENT_PER_PAGE });
};

module.exports.addComment = async (req, res) => {
  const { comment: commentBody, blogId, replyId } = req.body;
  const { user } = req;
  const validate = commentValidation.comment.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
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
    await Comment.create({
      comment: commentBody,
      user: user._id,
      blog: blog._id,
      userModel,
    });
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
  res.redirect("back");
};

module.exports.deleteComment = async (req, res) => {
  const { commentId, replyComment, replyId } = req.body;
  // If target was comment not reply comment
  if (!replyComment && !replyId) {
    try {
      const comment = await Comment.findOne({ _id: commentId });
      ForbiddenError.from(req.ability).throwUnlessCan("delete", comment);
      if (!comment) {
        return res.status(404).json({ message: "Comment not founded!" });
      }
      await Comment.deleteOne({ _id: commentId });
      res.status(200).json({ message: "کامنت مورد نظر با موفقیت حذف گردید!" });
    } catch (error) {
      res.status(403).json({ message: "Forbidden!" });
    }
  } else if (replyComment === true && replyId) {
    const parentCm = await Comment.findOne({ "replies._id": replyId });
    const replyIndex = parentCm.replies.findIndex((cm) => {
      return cm._id.toString() === replyId.toString();
    });
    const replyCm = parentCm.replies[replyIndex];
    try {
      ForbiddenError.from(req.ability).throwUnlessCan("delete", replyCm);
    } catch (error) {
      return res.status(403).json({ message: "Forbidden!" });
    }
    parentCm.replies.splice(replyIndex, 1);
    await parentCm.save();
    res.status(200).json({ message: "کامنت مورد نظر با موفقیت حذف گردید!" });
  }
};

// API
module.exports.readComment = async (req, res) => {
  const { commentId } = req.params;
  const { replyId } = req.query;
  if (!replyId) {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not founded!" });
    }
    if (req.user._id.toString() !== comment.user.toString()) {
      return res.status(402).json({ message: "Forbidden!" });
    }
    res.status(200).json({ message: "Get comment successful!", comment });
  } else {
    const comment = await Comment.findOne({ _id: commentId });
    const [replyComment] = comment.replies.filter((cm) => {
      return cm._id.toString() === replyId.toString();
    });
    res
      .status(200)
      .json({ message: "Get comment successful!", comment: replyComment });
  }
};

module.exports.updateComment = async (req, res) => {
  const { commentId, comment: commentBody, replyId } = req.body;
  const validate = commentValidation.comment.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (!replyId.length) {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment)
      throw new ErrorResponse(
        422,
        "مشکلی پیش آمده، لطفا بعدا دوباره تلاش کنید!",
        "back",
      );
    if (comment.user.toString() !== req.user._id.toString()) {
      throw new ErrorResponse(402, "Forbidden!", "back");
    }
    // Update comment body.
    comment.comment = commentBody;
    await comment.save();
  } else {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment)
      throw new ErrorResponse(
        422,
        "مشکلی پیش آمده، لطفا بعدا دوباره تلاش کنید!",
        "back",
      );
    const [replyComment] = comment.replies.filter(
      (comment) => comment._id.toString() === replyId.toString(),
    );
    if (replyComment.user.toString() !== req.user._id.toString()) {
      throw new ErrorResponse(402, "Forbidden!", "back");
    }
    // Update comment body.
    replyComment.comment = commentBody;
    await comment.save();
  }
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
};
