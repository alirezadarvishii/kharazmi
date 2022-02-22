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

  async updateById(blogId, blogDto) {
    const result = await Blog.updateOne({ _id: blogId }, blogDto);
    return result;
  }
}

module.exports = BlogRepository;
