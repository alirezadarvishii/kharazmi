const path = require("path");

const httpStatus = require("http-status");
const { Types } = require("mongoose");

const Blog = require("../model/blog");
const ApiError = require("../errors/ApiError");
const downloadFile = require("../lib/download-file");

class BlogService {
  async create(blogDto) {
    const filename = `${Date.now()}.jpeg`;
    const options = {
      quality: 60,
      buffer: blogDto.blogImg.buffer,
      path: path.join(__dirname, "..", "public", "blogs", filename),
    };
    await downloadFile(options);
    const authorModel = blogDto.authorModel === "admin" ? "Admin" : "Teacher";
    const tags = blogDto.tags.split("/");
    const slug = blogDto.title.split(" ").join("-");
    const blog = {
      ...blogDto,
      slug,
      tags,
      blogImg: filename,
      author: blogDto.user,
      authorModel,
    };
    await Blog.create(blog);
  }

  async getBlogs(query, queryOption = {}) {
    const { slide = 0, BLOGS_PER_PAGE = 0, sort, populate } = queryOption;
    const filter = { ...query };
    const options = {
      sort,
      populate,
      skip: BLOGS_PER_PAGE * (slide - 1),
      limit: BLOGS_PER_PAGE,
    };
    const blogs = await Blog.find(filter, null, options);
    return blogs;
  }

  async findOne(blogId, queryOptions) {
    const blog = await Blog.findOne({ _id: blogId }, null, queryOptions);
    return blog;
  }

  async getBlog(blogId, userId) {
    const [blog] = await Blog.aggregate([
      { $match: { _id: Types.ObjectId(blogId), status: "approved" } },
      {
        $addFields: {
          isLiked: {
            $cond: {
              if: {
                $gte: [
                  { $indexOfArray: ["$likes", Types.ObjectId(userId)] },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);
    if (!blog) {
      throw new ApiError({
        statusCode: httpStatus.NOT_FOUND,
        code: httpStatus[404],
        redirectionPath: "/notFounded",
        message: "مشکلی پیش آمده است!",
      });
    }
    await Blog.populate(blog, ["author", "category"]);
    return blog;
  }

  async updateBlog(blogId, blogDto) {
    const tags = blogDto.tags.split("/");
    const blog = await Blog.findOne({ _id: blogId });
    if (blogDto.blogImg) {
      const option = {
        quality: 60,
        path: path.join(__dirname, "..", "public", "blogs", blog.blogImg),
        buffer: blogDto.blogImg,
      };
      await downloadFile(option);
    }
    await Blog.updateOne({ _id: blogId }, { ...blogDto, tags });
  }

  async deleteBlog(blogId) {
    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      throw new ApiError({
        message: "پست مورد نظر یافت نشد!",
        code: httpStatus[404],
        statusCode: httpStatus.NOT_FOUND,
        redirectionPath: "back",
      });
    }
    await Blog.deleteOne({ _id: blogId });
  }

  async increamentViews(blogId, ip) {
    const blog = await Blog.findOne({ _id: blogId });
    const isBeforeVisited = blog.visit.findIndex((visitIp) => visitIp === ip);
    if (isBeforeVisited < 0) {
      await Blog.updateOne({ _id: blogId }, { $push: { visit: ip } });
    }
  }

  async like(blogId, userId) {
    const blog = await Blog.findOne({ _id: blogId });
    const isLiked = blog.likes.includes(userId);
    if (!isLiked) {
      blog.likes.push(userId);
    } else {
      const likes = blog.likes.filter((like) => {
        return like.toString() !== userId.toString();
      });
      blog.likes = [...likes];
    }
    await blog.save();
    return {
      likesLength: blog.likes.length,
    };
  }

  async approve(blogId) {
    await Blog.updateOne({ _id: blogId }, { $set: { status: "approved" } });
  }

  async unApprove(blogId) {
    await Blog.updateOne({ _id: blogId }, { $set: { status: "notApproved" } });
  }

  async countDocuments(query) {
    const length = await Blog.countDocuments({ ...query });
    return length;
  }
}

module.exports = new BlogService();
