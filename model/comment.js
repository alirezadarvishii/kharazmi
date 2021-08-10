const mongoose = require("mongoose");

const ReplyCommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  userModel: {
    type: String,
    enum: ["User", "Teacher", "Admin"],
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    refPath: "replies.userModel",
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
    userModel: {
      type: String,
      enum: ["User", "Teacher", "Admin"],
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      refPath: "userModel",
      required: true,
    },
    votes: [{ type: mongoose.Types.ObjectId }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
