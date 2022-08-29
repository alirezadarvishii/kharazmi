const httpStatus = require("http-status");

const Comment = require("../model/blogs.comment");
const ApiError = require("../lib/ApiError");

class CommentService {
  async getComments(blogId, slide) {
    const COMMENT_PER_PAGE = 10;
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: "desc" })
      .populate("author replies.author")
      .limit(slide * COMMENT_PER_PAGE);
    return comments;
  }

  async getComment(commentId) {
    const comment = await Comment.findOne({ _id: commentId });
    return comment;
  }

  async getReplyComment(commentId, replyId) {
    const comment = await Comment.findOne({ _id: commentId });
    const [replyComment] = comment.replies.filter((cm) => {
      return cm._id.toString() === replyId.toString();
    });
    return replyComment;
  }

  async countDocuments(blogId = "") {
    if (blogId.length) {
      const length = await Comment.countDocuments({ blog: blogId });
      return length;
    } else {
      const length = await Comment.countDocuments({});
      return length;
    }
  }

  async newComment(commentDto) {
    const result = await Comment.create({ ...commentDto });
    return result;
  }

  async newReplyComment(replyId, commentDto) {
    const comment = await Comment.findOne({ _id: replyId });
    const replyDoc = {
      comment: commentDto.commentBody,
      authorModel: commentDto.authorModel,
      author: commentDto.author,
    };
    comment.replies.push(replyDoc);
    await comment.save();
  }

  async deleteComment(commentId) {
    await Comment.deleteOne({ _id: commentId });
  }

  async deleteReplyComment(replyId) {
    const parentCm = await Comment.findOne({ "replies._id": replyId });
    const replyIndex = parentCm.replies.findIndex((cm) => {
      return cm._id.toString() === replyId.toString();
    });
    parentCm.replies[replyIndex];
    try {
      parentCm.replies.splice(replyIndex, 1);
      const result = await parentCm.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async updateComment(commentId, commentDto) {
    const comment = await Comment.findOne({ _id: commentId });
    comment.comment = commentDto.commentBody;
    await comment.save();
  }

  async updateReplyComment(commentId, replyId, commentDto, auth) {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      throw new ApiError({
        statusCode: httpStatus.NOT_FOUND,
        code: httpStatus[404],
        message: "کامنت یافت نشد!",
        redirectionPath: "back",
      });
    }
    const [replyComment] = comment.replies.filter(
      (cm) => cm._id.toString() === replyId.toString(),
    );
    if (replyComment.author.toString() !== auth.user.toString()) {
      throw new ApiError({
        statusCode: httpStatus.FORBIDDEN,
        code: httpStatus[403],
        message: "FORBIDDEN",
        redirectionPath: "back",
      });
    }
    // Update comment body.
    replyComment.comment = commentDto.commentBody;
    await comment.save();
  }
}

module.exports = new CommentService();
