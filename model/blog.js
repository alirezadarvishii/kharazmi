const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      refPath: "authorModel",
      required: true,
    },
    authorModel: {
      type: String,
      enum: ["Admin", "Teacher"],
    },
    blogImg: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "notApproved"],
      default: "notApproved",
    },
    comments: [{ type: mongoose.Types.ObjectId }],
    likes: [{ type: mongoose.Types.ObjectId }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
