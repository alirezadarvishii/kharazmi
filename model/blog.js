const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
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
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "blog_categories",
      required: true,
    },
    tags: [{ type: String, required: true }],
    comments: [{ type: mongoose.Types.ObjectId }],
    likes: [{ type: mongoose.Types.ObjectId }],
    visit: [{ type: String }],
  },
  { timestamps: true },
);

blogSchema.index({ title: "text" });

module.exports = mongoose.model("Blog", blogSchema);
