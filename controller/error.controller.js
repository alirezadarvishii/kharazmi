module.exports._404 = (req, res) => {
  res.render("error/404", {
    title: "صفحه مورد نظر یافت نشد | 404",
  });
};


module.exports._500 = (err, req, res, next) => {
  const { statusCode = 500, redirectionPath, message } = err;
  console.log(err);
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
