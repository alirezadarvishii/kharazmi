const mongoose = require("mongoose");

const blogCategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enName: {
    type: String,
    required: true,
  },
});

const blogCategoriesModel = mongoose.model("blog_categories", blogCategoriesSchema);

module.exports = blogCategoriesModel;
