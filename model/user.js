const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "user",
    },
    bio: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);