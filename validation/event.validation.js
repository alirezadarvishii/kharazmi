const joi = require("joi");

exports.eventSchema = joi.object({
  title: joi.string().required().messages({ "string.empty": "تیتر رویداد الزامی است!" }),
  start: joi.string().required().messages({ "string.empty": "فیلد تاریخ شروع رویداد الزامی است!" }),
  time: joi.string().allow(""),
  description: joi.string().required().messages({ "string.empty": "فیلد توضیحات رویداد الزامی است!" }),
  eventId: joi.allow(),
  _csrf: joi.allow(),
});
