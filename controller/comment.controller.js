const Blog = require("../model/blog");
const Comment = require("../model/comment");
const ErrorResponse = require("../../NodeJS/news-with-backend/utils/errorResponse");
const commentValidation = require("../validation/comment.validation");

exports.addComment = async (req, res) => {
  const { comment: commentBody, blogId, replyId } = req.body;
  const { user } = req;
  const validate = commentValidation.comment.validate(req.body);
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
  const validate = commentValidation.comment.validate(req.body);
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
