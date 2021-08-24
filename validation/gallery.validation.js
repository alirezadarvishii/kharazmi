const joi = require("joi");

exports.addNewImgToGallery = joi.object({
  caption: joi.string().required().messages({ "string.empty": "کپشن تصویر الزامی است!" }),
  _csrf: joi.allow(),
});

exports.editGalleryImg = joi.object({
  caption: joi.string(),
  imgId: joi.string().required(),
  _csrf: joi.allow(),
});
