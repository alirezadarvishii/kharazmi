const { Schema, model } = require("mongoose");

const gallerySchema = new Schema({
  img: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
});

module.exports = model("Gallery", gallerySchema);
