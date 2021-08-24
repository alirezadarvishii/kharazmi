const joi = require("joi");

exports.blog = joi.object({
  title: joi.string().required().messages({ "string.empty": "فیلد تیتر پست الزامی است!" }),
  category: joi.string().required().messages({ "string.empty": "فیلد دسته بندی الزامی است!" }),
  body: joi.string().required().messages({ "string.empty": "فیلد متن پست الزامی است!" }),
  tags: joi.string().required().messages({ "string.empty": "فیلد تگ ها الزامی است!" }),
  blogId: joi.allow(),
  _csrf: joi.allow(),
});
