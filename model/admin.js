const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "notApproved"],
      default: "notApproved",
    },
    role: {
      type: String,
      default: "admin",
    },
    superadmin: { type: Boolean },
    bio: String,
  },
  { timestamps: true }
);

adminSchema.index({ fullname: "text" });

module.exports = mongoose.model("Admin", adminSchema);
