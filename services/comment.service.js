const Comment = require("../model/blogs.comment");

const ErrorResponse = require("../utils/errorResponse");

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
      authorModel: commentDto.author,
      author: commentDto.author,
    };
    comment.replies.push(replyDoc);
    await comment.save();
  }

  async deleteComment(commentId) {
    try {
      await Comment.findOne({ _id: commentId });
      // if (!comment) {
      //   return res.status(404).json({ message: "Comment not founded!" });
      // }
      const result = await Comment.deleteOne({ _id: commentId });
      return result;
    } catch (error) {
      // TODO Send better result for error
      return null;
    }
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

  async updateComment(commentId, commentDto, auth) {
    const comment = await Comment.findOne({ _id: commentId });
    if (comment.user.toString() !== auth.user.toString()) {
      throw new ErrorResponse(402, "Forbidden!", "back");
    }
    comment.comment = commentDto.commentBody;
    await comment.save();
  }

  async updateReplyComment(commentId, replyId, commentDto, auth) {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment)
      throw new ErrorResponse(
        422,
        "مشکلی پیش آمده، لطفا بعدا دوباره تلاش کنید!",
        "back",
      );
    const [replyComment] = comment.replies.filter(
      (cm) => cm._id.toString() === replyId.toString(),
    );
    if (replyComment.user.toString() !== auth.user.toString()) {
      throw new ErrorResponse(402, "Forbidden!", "back");
    }
    // Update comment body.
    replyComment.comment = commentDto.commentBody;
    await comment.save();
  }
}

module.exports = new CommentService();
