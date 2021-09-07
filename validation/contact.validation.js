const joi = require("joi");

exports.comment = joi.object({
  fullname: joi.string().required().messages({ "string.empty": "فیلد نام و نام خانوادگی الزامی است!" }),
  email: joi.string().email().messages({ "string.empty": "فیلد ایمیل الزامی است!" }),
  phone: joi.string().messages({ "string.empty": "فیلد تلفن تماس الزامی است!" }),
  content: joi.string().messages({ "string.empty": "فیلد متن پیام الزامی است!" }),
  _csrf: joi.allow(),
});
