const axios = require("axios");
const httpStatus = require("http-status");

const ApiError = require("../lib/ApiError");

module.exports = async (req, res, next) => {
  const { "g-recaptcha-response": recaptchaResponse } = req.body;
  try {
    const captchaVerification = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`,
    );
    if (captchaVerification && captchaVerification.data.success) {
      next();
    } else {
      throw new ApiError({
        statusCode: httpStatus.FORBIDDEN,
        code: httpStatus[403],
        message: "خطا در احراز هویت کپچا، گزینه من ربات نیستم را فراموش نکنید!",
        redirectionPath: "back",
      });
    }
  } catch (error) {
    throw new ApiError({
      statusCode: httpStatus.FORBIDDEN,
      code: httpStatus[403],
      message: "خطادر احراز هویت کپچا، گزینه من ربات نیستم را فراموش نکنید!",
      redirectionPath: "back",
    });
  }
};
