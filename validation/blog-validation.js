const joi = require("joi");

exports.addNewPost = joi.object({
  title: joi.string().required().messages({ "string.empty": "فیلد رمز عبور فعلی الزامی است!" }),
  category: joi.string().required().messages({ "string.empty": "فیلد رمز عبور جدید الزامی است!" }),
  body: joi.string().required().messages({ "string.empty": "فیلد متن بلاگ الزامی است!" }),
  tags: joi.string().required().messages({ "string.empty": "حدااقل یک تگ الزامی است!" }),
  _csrf: joi.allow(),
});

exports.comment = joi.object({
  comment: joi.string().required().messages({ "string.empty": "متن کامنت الزامیه!" }),
  blogId: joi.allow(),
  replyId: joi.allow(),
  commentId: joi.allow(),
  _csrf: joi.allow(),
});
