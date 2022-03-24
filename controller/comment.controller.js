const path = require("path");

const ejs = require("ejs");

const CommentService = require("../services/comment.service");
const ErrorResponse = require("../utils/errorResponse");
const commentValidation = require("../validation/comment.validation");
const { moment } = require("../utils/moment");
const { momentTime } = require("../utils/moment");

module.exports.getComments = async (req, res) => {
  const { blogId } = req.params;
  const { slide = 1 } = req.query;
  const comments = await CommentService.getComments(blogId, slide);
  const commentsUI = await ejs.renderFile(
    path.join(__dirname, "..", "views", "includes", "comments.ejs"),
    {
      comments,
      moment,
      momentTime,
      user: req.user,
    },
  );
  const commentsLength = await CommentService.commentsLength(blogId);
  // TODO Fix constants
  res.status(200).json({ commentsUI, commentsLength, commentsPerPage: 10 });
};

module.exports.addComment = async (req, res) => {
  const { comment: commentBody, blogId, replyId } = req.body;
  const { user } = req;
  const validate = commentValidation.comment.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  // eslint-disable-next-line fp/no-let
  let authorModel;
  if (user.role === "admin") {
    authorModel = "Admin";
  } else if (user.role === "teacher") {
    authorModel = "Teacher";
  } else if (user.role === "user") {
    authorModel = "User";
  }
  if (!replyId) {
    const commentDto = {
      comment: commentBody,
      author: user._id,
      blog: blogId,
      authorModel,
    };
    await CommentService.newComment(commentDto);
  } else {
    const commentDto = {
      commentBody,
      authorModel,
      author: req.user._id,
    };
    await CommentService.newReplyComment(replyId, commentDto);
  }
  req.flash("success", "کامنت شما با موفقیت درج شد!");
  res.redirect("back");
};

module.exports.deleteComment = async (req, res) => {
  const { commentId, replyComment, replyId } = req.body;
  // If target was comment, not reply comment
  if (!replyComment && !replyId) {
    await CommentService.deleteComment(commentId, req.ability);
  } else if (replyComment === true && replyId) {
    await CommentService.deleteReplyComment(replyId, req.ability);
    // TODO Fix error handling
    res.status(200).json({ message: "کامنت مورد نظر با موفقیت حذف گردید!" });
  }
};

// API
module.exports.readComment = async (req, res) => {
  const { commentId } = req.params;
  const { replyId } = req.query;
  if (!replyId) {
    const comment = await CommentService.getComment(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not founded!" });
    }
    if (req.user._id.toString() !== comment.user.toString()) {
      return res.status(402).json({ message: "Forbidden!" });
    }
    res.status(200).json({ message: "Get comment successful!", comment });
  } else {
    const replyComment = await CommentService.getReplyComment(
      commentId,
      replyId,
    );
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
    const commentDto = {
      commentBody,
    };
    await CommentService.updateComment(commentId, commentDto, {
      user: req.user._id,
    });
  } else {
    const commentDto = {
      commentBody,
    };
    await CommentService.updateReplyComment(commentId, replyId, commentDto, {
      user: req.user._id,
    });
  }
  req.flash("success", "عملیات با موفقیت انجام شد!");
  res.redirect("back");
};
