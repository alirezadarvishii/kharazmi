const axios = require("axios");

module.exports = async (req, res, next) => {
  const { "g-recaptcha-response": recaptchaResponse } = req.body;
  let captchaVerification;
  try {
    captchaVerification = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`
    );
    if (captchaVerification && captchaVerification.data.success) {
      next();
    } else {
      req.flash("error", "خطا  در کپچا، گزینه من ربات نیستم را فراموش نکنید!");
      res.redirect("back");
    }
  } catch (error) {
    req.flash("error", "خطا  در کپچا، گزینه من ربات نیستم را فراموش نکنید!");
    res.redirect("back");
  }
};
