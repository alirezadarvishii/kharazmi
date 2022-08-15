const joi = require("joi");

module.exports.addNewImgToGallery = {
  body: joi.object().keys({
    caption: joi
      .string()
      .required()
      .messages({ "string.empty": "کپشن تصویر الزامی است!" }),
    _csrf: joi.allow(),
  }),
};

module.exports.editGalleryImg = {
  body: joi.object().keys({
    caption: joi.string(),
    imgId: joi.string().required(),
    _csrf: joi.allow(),
  }),
};
