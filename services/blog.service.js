const path = require("path");

const sharp = require("sharp");

const BlogRepo = require("../database/blog.repository");
const Blog = require("../model/blog");
const ErrorResponse = require("../utils/ErrorResponse");
const { ForbiddenError } = require("@casl/ability");

class BlogService {
  async createBlog(blogDto) {
    const filename = `${Date.now()}.jpeg`;
    await sharp(blogDto.blogImg[0].buffer)
      .jpeg({ quality: 60 })
      .toFile(path.join(__dirname, "..", "public", "blogs", filename))
      .catch((err) => {
        console.log("Sharp Error: ", err);
        throw new ErrorResponse(422, "خطا در بارگیری تصویر!", "back");
      });
    const authorModel = blogDto.user.role === "admin" ? "Admin" : "Teacher";
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
    const result = await new BlogRepo().store(blog);
    console.log(result);
  }

  async getBlogs(filters, sort, pagination) {
    const { slide, BLOGS_PER_PAGE } = pagination;
    const filter = { ...filters, status: "approved" };
    const option = {
      sort,
      populate: "author",
      skip: BLOGS_PER_PAGE * (slide - 1),
      limit: BLOGS_PER_PAGE,
    };
    const blogs = await new BlogRepo().find(filter, option);
    return blogs;
  }

  async getBlog(blogId, userId) {
    // const [blog] = await Blog.aggregate([
    //   { $match: { _id: Types.ObjectId(blogId), status: "approved" } },
    //   {
    //     $addFields: {
    //       isLiked: {
    //         $cond: {
    //           if: { $gte: [{ $indexOfArray: ["$likes", userId] }, 0] },
    //           then: true,
    //           else: false,
    //         },
    //       },
    //     },
    //   },
    // ]);
    const filters = { _id: blogId, status: "approved" };
    const option = {
      populate: ["author", "category"],
    };
    const blog = await new BlogRepo().findOne(filters, option);
    if (!blog) throw new ErrorResponse(404, "Not founded!", "/notFounded");
    // If user liked this blog add isLiked = true filed to blog object, If not isLiked = false
    // TODO create a method for this task in repository, later.
    // TODO Optimise It.
    if (blog.likes.includes(userId.toString())) {
      blog.isLikde = true;
    } else {
      blog.isLiked = false;
    }
    return blog;
  }

  async updateBlog(blogId, blogDto) {
    const tags = blogDto.tags.split("/");
    const blog = await new BlogRepo().findOne({ _id: blogId });
    if (blogDto.blogImg) {
      await sharp(blogDto.blogImg.buffer)
        .jpeg({
          quality: 60,
        })
        .toFile(path.join(__dirname, "..", "public", "blogs", blog.blogImg));
    }
    await new BlogRepo().updateOne({ _id: blogId }, { ...blogDto, tags });
  }

  async deleteBlog(blogId, auth) {
    const blog = await Blog.findOne({ _id: blogId });
    ForbiddenError.from(auth.ability).throwUnlessCan("update", blog);
    if (!blog) throw new ErrorResponse(404, "پست مورد نظر یافت نشد!", "back");
    await Blog.deleteOne({ _id: blogId });
  }

  async increamentViews(blogId, ip) {
    const blog = await new BlogRepo().findOne({ _id: blogId });
    const isBeforeVisited = blog.visit.findIndex((visitIp) => visitIp === ip);
    if (isBeforeVisited < 0) {
      await new BlogRepo().updateOne({ _id: blogId }, { $push: { visit: ip } });
    }
  }

  async like(blogId, userId) {
    const blog = await new BlogRepo().findOne({ _id: blogId });
    const isLiked = blog.likes.includes(userId);
    if (!isLiked) {
      blog.likes.push(userId);
    } else {
      const likes = blog.likes.filter((like) => {
        return like.toString() !== userId.toString();
      });
      blog.likes = [...likes];
    }
    await new BlogRepo().save(blog);
    return {
      likesLength: blog.likes.length,
    };
  }

  async approve(blogId, auth) {
    ForbiddenError.from(auth.ability).throwUnlessCan("publish", "Blog");
    await new BlogRepo().updateOne(
      { _id: blogId },
      { $set: { status: "approved" } },
    );
  }

  async unApprove(blogId, auth) {
    ForbiddenError.from(auth.ability).throwUnlessCan("publish", "Blog");
    await new BlogRepo().updateOne(
      { _id: blogId },
      { $set: { status: "notApproved" } },
    );
  }

  async blogsLength() {
    const length = await new BlogRepo().countDocuments({ status: "approved" });
    return length;
  }
}

module.exports = BlogService;
