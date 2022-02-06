const { ForbiddenError } = require("@casl/ability");

module.exports.notFound = (req, res) => {
  res.render("error/404", {
    title: "صفحه مورد نظر یافت نشد | 404",
  });
};

// eslint-disable-next-line
module.exports.serverError = (err, req, res, next) => {
  const { statusCode = 500, redirectionPath, message } = err;
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  if (err instanceof ForbiddenError) {
    return res.status(403).redirect("/");
  }
  if (err.code === "EBADCSRFTOKEN") {
    return res.send("Csrf Token is invalid! <a href='/'>Back to Home</a>");
  }
  if (statusCode < 500) {
    req.flash("error", message);
    return res.redirect(redirectionPath);
  }
  res.render("error/500", {
    title: "خطایی از سمت سرور رخ داده است | 500",
  });
};
