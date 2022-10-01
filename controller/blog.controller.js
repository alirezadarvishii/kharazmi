const path = require("path");

const { ForbiddenError } = require("@casl/ability");

const BlogService = require("../services/blog.service");
const CategoryService = require("../services/category.service");
const pick = require("../utils/pick");
const genPagination = require("../utils/pagination");
const downloadFile = require("../lib/download-file");

module.exports.blog = async (req, res) => {
  const { slide = 1, q = "", sort, category } = req.query;
  const BLOGS_PER_PAGE = 9;
  const filters = pick(req.query, ["category"]);
  if (q.length) {
    Object.assign(filters, { $text: { $search: q } });
  }
  const queryOptions = {
    slide,
    BLOGS_PER_PAGE,
    sort,
    populate: "author",
  };
  const blogs = await BlogService.getBlogs(filters, queryOptions);
  const blogsLength = await BlogService.countDocuments();
  const pagination = genPagination(BLOGS_PER_PAGE, blogsLength);
  const categories = await CategoryService.getCategories();
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
  const blog = await BlogService.getBlog(blogId, req.user?._id);
  await BlogService.increamentViews(blogId, ip);
  const otherBlogs = await BlogService.getBlogs();
  res.render("blog/single-blog", {
    title: blog.title,
    blog,
    otherBlogs,
  });
};

module.exports.getBlogInPrivateMode = async (req, res) => {
  if (req.user.role === "admin") {
    const { blogId } = req.params;
    const queryOptions = {
      projection: "title body tags",
    };
    const blog = await BlogService.findOne({ _id: blogId }, queryOptions);
    res.status(200).json({ message: "Operation successful", blog });
  } else {
    res.status(403).redirect("/");
  }
};

module.exports.addBlog = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "Blog");
  const categories = await CategoryService.getCategories();
  res.render("blog/add-blog", {
    title: "افزودن پست جدید",
    headerTitle: "افزودن پست جدید",
    categories,
  });
};

module.exports.handleAddBlog = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "Blog");
  const blogDto = {
    ...req.body,
    user: req.user._id,
    authorModel: req.user.role,
    blogImg: req.files.blogImg[0],
  };
  await BlogService.create(blogDto);
  req.flash(
    "success",
    "پست جدید با موفقیت ساخته شد و با تأیید نهایی از سوی مدیریت در حالت عمومی قرار میگیرد!",
  );
  res.redirect("/");
};

module.exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await BlogService.findOne({ _id: blogId });
  const categories = await CategoryService.getCategories();
  ForbiddenError.from(req.ability).throwUnlessCan("update", blog);
  res.render("blog/update-blog", {
    title: `ویرایش بلاگ ${blog.title}`,
    headerTitle: `ویرایش ${blog.title}`,
    blog,
    categories,
  });
};

module.exports.handleUpdateBlog = async (req, res) => {
  const { blogId } = req.body;
  const blog = await BlogService.findOne({ _id: blogId });
  ForbiddenError.from(req.ability).throwUnlessCan("update", blog);
  const newValues = pick(req.body, [
    "title",
    "category",
    "body",
    "tags",
    "description",
  ]);
  const blogDto = {
    ...newValues,
  };
  await BlogService.updateBlog(blogId, blogDto);
  req.flash("success", "پست شما با موفقیت ویرایش گردید!");
  res.redirect("/me/blogs");
};

module.exports.handleDeleteBlog = async (req, res) => {
  const { blogId } = req.body;
  const blog = await BlogService.findOne(blogId);
  ForbiddenError.from(req.ability).throwUnlessCan("update", blog);
  await BlogService.deleteBlog(blogId);
  req.flash("success", "پست مورد نظر با موفقیت حذف گردید!");
  res.redirect("back");
};

module.exports.likeBlog = async (req, res) => {
  const { blogId } = req.params;
  const result = await BlogService.like(blogId, req.user._id);
  res.status(200).json({
    blogLikesLength: result.likesLength,
    message: "Operation completed successfuly!",
  });
};

module.exports.approveBlog = async (req, res) => {
  const { blogId } = req.body;
  ForbiddenError.from(req.ability).throwUnlessCan("publish", "Blog");
  await BlogService.approve(blogId);
  req.flash("success", "تغییرات با موفقیت اعمال شد!");
  res.redirect("back");
};

module.exports.unApproveBlog = async (req, res) => {
  const { blogId } = req.body;
  ForbiddenError.from(req.ability).throwUnlessCan("publish", "Blog");
  await BlogService.unApprove(blogId);
  req.flash("success", "تغییرات با موفقیت اعمال شد!");
  res.redirect("back");
};

module.exports.downloadBlogImg = async (req, res) => {
  const filename = `${Date.now()}.jpeg`;
  await downloadFile({
    quality: 60,
    filename,
    path: path.join(__dirname, "..", "public", "blogs", filename),
    buffer: req.files.upload[0].buffer,
  });
  return res
    .status(200)
    .json({ url: `http://localhost:3000/blogs/${filename}` });
};

module.exports.addNewCategory = async (req, res) => {
  const { categoryNameInPersian, categoryNameInEnglish } = req.body;
  ForbiddenError.from(req.ability).throwUnlessCan("create", "Category");
  const categoryDto = {
    name: categoryNameInPersian,
    enName: categoryNameInEnglish,
  };
  await CategoryService.create(categoryDto);
  req.flash("success", "دسته بندی با موفقیت افزوده شد!");
  res.status(200).redirect("back");
};

module.exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  ForbiddenError.from(req.ability).throwUnlessCan("delete", "Category");
  await CategoryService.delete(categoryId);
  req.flash("success", "دسته بندی مورد نظر حذف گردید");
  res.status(200).redirect("back");
};
