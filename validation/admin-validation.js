const joi = require("joi");

exports.eventSchema = joi.object({
  start: joi.date().required().messages({ "string.empty": "فیلد تاریخ شروع رویداد الزامی است!" }),
  time: joi.string().allow(""),
  description: joi.string().required().messages({ "string.empty": "فیلد توضیحات رویداد الزامی است!" }),
  _csrf: joi.allow(),
});
