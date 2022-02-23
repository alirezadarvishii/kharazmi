const Blog = require("../model/blog");

class BlogRepository {
  async find(filter, option) {
    const blogs = await Blog.find(filter, option);
    return blogs;
  }

  async findOne(filter, option) {
    const blog = await Blog.findOne(filter, option);
    return blog;
  }

  async store(blogDto) {
    const result = await Blog.create(blogDto);
    return result;
  }

  async deleteById(option) {
    const result = await Blog.deleteOne(option);
    return result;
  }

  async updateOne(filters, blogDto) {
    const result = await Blog.updateOne(filters, blogDto);
    return result;
  }

  async save(doc) {
    const result = await doc.save();
    return result;
  }

  async countDocuments(filters) {
    const length = await Blog.countDocuments(filters);
    return length;
  }
}

module.exports = BlogRepository;
