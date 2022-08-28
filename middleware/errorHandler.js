const { ForbiddenError } = require("@casl/ability");

module.exports.pageNotFound = (req, res) => {
  res.render("error/404", {
    title: "صفحه مورد نظر یافت نشد | 404",
  });
};

// eslint-disable-next-line
module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, redirectionPath, message } = err;
  if (err instanceof ForbiddenError) {
    if (req.xhr) return res.status(403).json({ message: "Forbidden" });
    return res.status(403).redirect("/");
  } else if (err.code === "EBADCSRFTOKEN") {
    return res.send("Csrf Token is invalid! <a href='/'>Back to Home</a>");
  } else if (req.xhr) {
    return res.status(statusCode).json({ message });
  } else if (statusCode < 500) {
    req.flash("error", message);
    return res.redirect(redirectionPath);
  }
  res.render("error/500", {
    title: "خطایی از سمت سرور رخ داده است | 500",
  });
};
