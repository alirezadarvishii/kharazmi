const path = require("path");

const sharp = require("sharp");
const { ForbiddenError } = require("@casl/ability");

const Blog = require("../model/blog");
const BlogService = require("../services/blog.service");
const CategoryService = require("../services/category.service");
const ErrorResponse = require("../utils/ErrorResponse");
const blogValidation = require("../validation/blog.validation");
const pick = require("../utils/pick");
const genPagination = require("../utils/pagination");

module.exports.blog = async (req, res) => {
  const { slide = 1, q = "", sort, category } = req.query;
  const BLOGS_PER_PAGE = 9;
  const filters = pick(req.query, ["category"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const paginationConfig = {
    slide,
    BLOGS_PER_PAGE,
  };
  const blogs = await new BlogService().getBlogs(
    filters,
    sort,
    paginationConfig,
  );
  const blogsLength = await new BlogService().blogsLength();
  const pagination = genPagination(BLOGS_PER_PAGE, blogsLength);
  const categories = await new CategoryService().getCategory();
  res.render("blog/blog", {
    title: "وبلاگ هنرستان",
    headerTitle: "وبـلـاگ هنرستان",
    blogs,
    pagination,
    blogsLength,
    currentSlide: slide,
    query: q,
    categories,
    sort,
    selectedCategory: category,
  });
};

module.exports.getBlog = async (req, res) => {
  const { blogId } = req.params;
  const { ip } = req;
  const blog = await new BlogService().getBlog(blogId, req.user);
  await new BlogService().increamentViews(blogId, ip);
  const otherBlogs = await new BlogService().getBlogs();
  res.render("blog/single-blog", {
    title: blog.title,
    blog,
    otherBlogs,
  });
};

// TODO check it
module.exports.getBlogInPrivateMode = async (req, res) => {
  if (req.user.role === "admin") {
    const { blogId } = req.params;
    const blog = await Blog.findOne(
      { _id: blogId },
      { title: 1, body: 1, tags: 1 },
    );
    res.status(200).json({ message: "Operation successful", blog });
  } else {
    res.status(403).redirect("/");
  }
};

module.exports.addBlog = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "Blog");
  const categories = await new CategoryService().getCategory();
  res.render("blog/add-blog", {
    title: "افزودن پست جدید",
    headerTitle: "افزودن پست جدید",
    categories,
  });
};

module.exports.handleAddBlog = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "Blog");
  const validate = blogValidation.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  const blogDto = {
    ...req.body,
    user: req.user._id,
    authorModel: req.user.role,
    blogImg: req.files.blogImg[0],
  };
  await new BlogService().createBlog(blogDto);
  req.flash(
    "success",
    "پست جدید با موفقیت ساخته شد و با تأیید نهایی از سوی مدیریت در حالت عمومی قرار میگیرد!",
  );
  res.redirect("/");
};

module.exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId });
  ForbiddenError.from(req.ability).throwUnlessCan("update", blog);
  res.render("blog/update-blog", {
    title: `ویرایش بلاگ ${blog.title}`,
    headerTitle: `ویرایش ${blog.title}`,
    blog,
  });
};

module.exports.handleUpdateBlog = async (req, res) => {
  const { blogId } = req.body;
  const validate = blogValidation.blog.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(402, validate.error.message, "back");
  }
  const blog = await Blog.findOne({ _id: blogId });
  ForbiddenError.from(req.ability).throwUnlessCan("update", blog);
  const newValues = pick(req.body, ["title", "category", "body"]);
  const blogDto = {
    ...newValues,
  };
  await new BlogService().update(blogId, blogDto);
  req.flash("success", "پست شما با موفقیت ویرایش گردید!");
  res.redirect("/me/blogs");
};

module.exports.handleDeleteBlog = async (req, res) => {
  const { blogId } = req.body;
  await new BlogService().delete(blogId, { ability: req.ability });
  req.flash("success", "پست مورد نظر با موفقیت حذف گردید!");
  res.redirect("back");
};

module.exports.likeBlog = async (req, res) => {
  const { blogId } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: "Authentication ERROR!" });
  }
  const result = await new BlogService().like(blogId, req.user._id);
  res.status(200).json({
    blogLikesLength: result.likesLength,
    message: "Operation completed successfuly!",
  });
};

module.exports.approveBlog = async (req, res) => {
  const { blogId } = req.body;
  await new BlogService().approve(blogId, { ability: req.ability });
  req.flash("success", "تغییرات با موفقیت اعمال شد!");
  res.redirect("back");
};

module.exports.unApproveBlog = async (req, res) => {
  const { blogId } = req.body;
  await new BlogService().unApprove(blogId, { ability: req.ability });
  req.flash("success", "تغییرات با موفقیت اعمال شد!");
  res.redirect("back");
};

module.exports.downloadBlogImg = async (req, res) => {
  // generate a name for image.
  const filename = `${Date.now()}.jpeg`;
  // Handle download image with sharp.
  await sharp(req.files.upload[0].buffer)
    .jpeg({ quality: 60 })
    .toFile(path.join(__dirname, "..", "public", "blogs", filename))
    .catch((err) => {
      console.log("SHARP ERROR: ", err);
      return res.status(400).json({ message: "Error in image downloading" });
    });
  return res
    .status(200)
    .json({ url: `http://localhost:3000/blogs/${filename}` });
};

module.exports.addNewCategory = async (req, res) => {
  const { categoryNameInPersian, categoryNameInEnglish } = req.body;
  const categoryDto = {
    name: categoryNameInPersian,
    enName: categoryNameInEnglish,
  };
  await new CategoryService().create(categoryDto, { ability: req.ability });
  req.flash("success", "دسته بندی با موفقیت افزوده شد!");
  res.status(200).redirect("back");
};

module.exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  await new CategoryService().delete(categoryId, { ability: req.ability });
  req.flash("success", "دسته بندی مورد نظر حذف گردید");
  res.status(200).redirect("back");
};
