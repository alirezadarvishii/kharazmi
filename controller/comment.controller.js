const path = require("path");

const ejs = require("ejs");
const httpStatus = require("http-status");
const { ForbiddenError } = require("@casl/ability");

const CommentService = require("../services/comment.service");
const { moment } = require("../utils/moment");
const { momentTime } = require("../utils/moment");
const ApiError = require("../lib/ApiError");

// API
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
  const commentsLength = await CommentService.countDocuments(blogId);
  res.status(200).json({ commentsUI, commentsLength, commentsPerPage: 10 });
};

module.exports.addComment = async (req, res) => {
  const { comment: commentBody, blogId, replyId } = req.body;
  const { user } = req;
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

// API
module.exports.deleteComment = async (req, res) => {
  const { commentId, replyComment, replyId } = req.body;
  if (!replyComment && !replyId) {
    const comment = await CommentService.getComment(commentId);
    ForbiddenError.from(req.ability).throwUnlessCan("delete", comment);
    await CommentService.deleteComment(commentId);
    res.status(200).json({ message: "کامنت مورد نظر با موفقیت حذف گردید!" });
  } else if (replyComment === true && replyId) {
    const comment = await CommentService.getReplyComment(commentId, replyId);
    if (
      req.user._id.toString() !== comment.author.toString() ||
      req.user.role !== "admin"
    ) {
      throw new ApiError({
        statusCode: httpStatus.FORBIDDEN,
        status: httpStatus[403],
        message: "Forbidden!",
      });
    }
    await CommentService.deleteReplyComment(replyId);
    return res
      .status(200)
      .json({ message: "کامنت مورد نظر با موفقیت حذف گردید!" });
  }
};

// API
module.exports.readComment = async (req, res) => {
  const { commentId } = req.params;
  const { replyId } = req.query;
  if (!replyId) {
    const comment = await CommentService.getComment(commentId);
    if (!comment) {
      throw new ApiError({
        statusCode: httpStatus.NOT_FOUND,
        status: httpStatus[404],
        message: "Comment not found!",
      });
    }
    if (req.user._id.toString() !== comment.author.toString()) {
      throw new ApiError({
        statusCode: httpStatus.FORBIDDEN,
        status: httpStatus[403],
        message: httpStatus["403_MESSAGE"],
      });
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
  if (!replyId.length) {
    const comment = await CommentService.getComment(commentId);
    ForbiddenError.from(req.ability).throwUnlessCan("update", comment);
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
