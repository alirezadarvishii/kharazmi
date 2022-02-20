const Blog = require("../model/blog");

class BlogService {
  async getBlogs(filters, sort, pagination) {
    const { slide, BLOGS_PER_PAGE } = pagination;
    const blogs = await Blog.find({ ...filters, status: "approved" })
      .sort(sort)
      .populate("author")
      .skip(BLOGS_PER_PAGE * (slide - 1))
      .limit(BLOGS_PER_PAGE);

    return blogs;
  }
}

module.exports = BlogService;
