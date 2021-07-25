const joi = require("joi");

exports.addNewPost = joi.object({
  title: joi.string().required().messages({ "string.empty": "فیلد رمز عبور فعلی الزامی است!" }),
  category: joi.string().required().messages({ "string.empty": "فیلد رمز عبور جدید الزامی است!" }),
  body: joi.string().required().messages({ "string.empty": "فیلد متن بلاگ الزامی است!" }),
  _csrf: joi.allow(),
});
