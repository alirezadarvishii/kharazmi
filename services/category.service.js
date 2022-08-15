const BlogCategory = require("../model/blog.categories");

class CategoryService {
  async getCategories() {
    const category = await BlogCategory.find({});
    return category;
  }

  async create(categoryDto) {
    await BlogCategory.create(categoryDto);
  }

  async delete(categoryId) {
    await BlogCategory.deleteOne({ _id: categoryId });
  }
}

module.exports = new CategoryService();
