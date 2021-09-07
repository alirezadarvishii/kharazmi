const joi = require("joi");

exports.contact = joi.object({
  comment: joi.string().required().messages({ "string.empty": "متن کامنت الزامیه!" }),
  blogId: joi.allow(),
  replyId: joi.allow(),
  commentId: joi.allow(),
  "g-recaptcha-response": joi.allow(),
  _csrf: joi.allow(),
});
