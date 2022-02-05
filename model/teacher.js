const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      uniqe: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
    },
    status: {
      type: String,
      enum: ["approved", "notApproved"],
      default: "notApproved",
    },
    role: {
      type: String,
      default: "teacher",
    },
    bio: String,
  },
  { timestamps: true },
);

teacherSchema.index({ fullname: "text" });

module.exports = mongoose.model("Teacher", teacherSchema);
