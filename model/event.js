const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventImg: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
