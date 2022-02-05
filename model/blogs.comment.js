const mongoose = require("mongoose");

const ReplyCommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  authorModel: {
    type: String,
    enum: ["User", "Teacher", "Admin"],
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    refPath: "replies.authorModel",
    required: true,
  },
});

const CommentSchema = new mongoose.Schema(
  {
    replies: [ReplyCommentSchema],
    comment: {
      type: String,
      required: true,
    },
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    authorModel: {
      type: String,
      enum: ["User", "Teacher", "Admin"],
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      refPath: "authorModel",
      required: true,
    },
    votes: [{ type: mongoose.Types.ObjectId }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Comment", CommentSchema);
