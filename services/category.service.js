const { ForbiddenError } = require("@casl/ability");

const BlogCategory = require("../model/blog.categories");

class CategoryService {
  async getCategory() {
    const category = await BlogCategory.find({});
    return category;
  }

  async create(categoryDto, auth) {
    ForbiddenError.from(auth.ability).throwUnlessCan("create", "Category");
    await BlogCategory.create(categoryDto);
  }

  async delete(categoryId, auth) {
    ForbiddenError.from(auth.ability).throwUnlessCan("delete", "Category");
    await BlogCategory.deleteOne({ _id: categoryId });
  }
}

module.exports = CategoryService;
