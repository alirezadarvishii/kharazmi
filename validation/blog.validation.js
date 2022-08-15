const joi = require("joi");

module.exports.blog = {
  body: joi.object().keys({
    title: joi
      .string()
      .required()
      .messages({ "string.empty": "فیلد تیتر پست الزامی است!" }),
    category: joi
      .string()
      .required()
      .messages({ "string.empty": "فیلد دسته بندی الزامی است!" }),
    body: joi
      .string()
      .required()
      .messages({ "string.empty": "فیلد متن پست الزامی است!" }),
    tags: joi
      .string()
      .required()
      .messages({ "string.empty": "فیلد تگ ها الزامی است!" }),
    description: joi.string().min(20).max(50).required().messages({
      "string.empty": "فیلد خلاصه الزامی است!",
      "string.min": "دسکریپشن حدااقل 20 کاراکتر!",
      "string.max": "دسکریپشن حدااکثر 50 کاراکتر!",
    }),
    blogId: joi.allow(),
    _csrf: joi.allow(),
  }),
};
