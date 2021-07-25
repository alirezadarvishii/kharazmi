const joi = require("joi");

exports.addNewImgToGallery = joi.object({
  caption: joi.string().required().messages({ "string.empty": "فیلد توضیحات الزامی است!" }),
  _csrf: joi.allow(),
});
