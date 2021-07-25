const path = require("path");

const sharp = require("sharp");

const Blog = require("../model/blog");
const ErrorResponse = require("../utils/ErrorResponse");
const blogValidation = require("../validation/blog-validation");

exports.blog = async (req, res) => {
  const blogs = await Blog.find({ status: "approved" }).populate("author");
  res.render("blog/blog", {
    title: "وبلاگ هنرستان",
    headerTitle: "وبـلـاگ مـدرسـه",
    blogs,
  });
};

exports.getBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId, status: "approved" }).populate("author");
  if (!blog) throw new ErrorResponse(404, "Not founded!", "/notFounded");
  res.render("blog/single-blog", {
    title: blog.title,
    blog,
  });
};

exports.addBlog = (req, res) => {
  res.render("blog/add-blog", {
    title: "افزودن پست جدید",
    headerTitle: "افزودن پست جدید",
  });
};

exports.handleAddBlog = async (req, res) => {
  const validate = blogValidation.addNewPost.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "/blog/add");
  }
  const filename = `${Date.now()}.jpeg`;
  await sharp(req.files.blogImg[0].buffer)
    .jpeg({
      quality: 60,
    })
    .toFile(path.join(__dirname, "..", "public", "blogs", filename), (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "/blog/new");
      }
    });
  // set author model for population author.
  const authorModel = req.user.role === "admin" ? "Admin" : "Teacher";
  await Blog.create({ ...req.body, blogImg: filename, author: req.user._id, authorModel });
  req.flash("success", "پست جدید با موفقیت ساخته شد و با تأیید نهایی از سوی مدیریت در حالت عمومی قرار میگیرد!");
  res.redirect("/");
};
