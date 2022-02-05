const joi = require("joi");

module.exports.adminValidation = joi.object({
  fullname: joi
    .string()
    .trim()
    .required()
    .messages({ "string.empty": "نام و نام خانوادگی الزامیه!" }),
  email: joi.string().email().trim().required().messages({
    "string.empty": "ایمیل الزامیه!",
    "string.email": "یه ایمیل صحیح وارد کن!",
  }),
  phoneNumber: joi
    .string()
    .trim()
    .required()
    .messages({ "string.empty": "تلفن همراه الزامی است!" }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه!",
  }),
  "g-recaptcha-response": joi.allow(),
  _csrf: joi.allow(),
});

module.exports.teacherValidation = joi.object({
  fullname: joi
    .string()
    .trim()
    .required()
    .messages({ "string.empty": "نام و نام خانوادگی الزامیه!" }),
  email: joi.string().email().trim().required().messages({
    "string.empty": "ایمیل الزامیه!",
    "string.email": "یه ایمیل صحیح وارد کن!",
  }),
  phoneNumber: joi
    .string()
    .trim()
    .required()
    .messages({ "string.empty": "تلفن همراه الزامی است!" }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه!",
  }),
  "g-recaptcha-response": joi.allow(),
  _csrf: joi.allow(),
});

module.exports.normalUserValidation = joi.object({
  fullname: joi
    .string()
    .trim()
    .required()
    .messages({ "string.empty": "نام و نام خانوادگی الزامیه!" }),
  email: joi.string().email().trim().required().messages({
    "string.empty": "ایمیل الزامیه!",
    "string.email": "یه ایمیل صحیح وارد کن!",
  }),
  phoneNumber: joi
    .string()
    .trim()
    .required()
    .messages({ "string.empty": "تلفن همراه الزامی است!" }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه!",
  }),
  "g-recaptcha-response": joi.allow(),
  _csrf: joi.allow(),
});

module.exports.loginValidation = joi.object({
  email: joi.string().email().trim().required().messages({
    "string.empty": "ایمیل الزامیه!",
    "string.email": "یه ایمیل صحیح وارد کن!",
  }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه!",
  }),
  loginType: joi
    .string()
    .valid("admin", "teacher", "user")
    .required()
    .messages({ "string.empty": "نوع ورود الزامیه" }),
  rememberme: joi.string(),
  "g-recaptcha-response": joi.allow(),
  _csrf: joi.allow(),
});

module.exports.editUserValidation = joi.object({
  fullname: joi.string().trim().min(5).max(20).required().messages({
    "string.empyt": "نام و نام خانوادگی الزامیه!",
    "string.min": "نام و نام خانوادگی نباید کمتر از 5 کاراکتر باشد!",
    "string.max": "نام و نام خانوادگی نباید بیشتر از 15 کاراکتر باشد!",
  }),
  bio: joi.string().allow("").trim(),
  _csrf: joi.allow(),
});

module.exports.changePasswordValidation = joi.object({
  currentPassword: joi.string().min(8).required().messages({
    "string.empty": "فیلد رمز عبور فعلی الزامی است!",
    "string.min": "رمز عبور فعلی نادرست است!",
  }),
  newPassword: joi.string().min(8).required().messages({
    "string.empty": "فیلد رمز عبور جدید الزامی است!",
    "string.min": "رمز عبور نباید کمتر از 8 کارکتر باشد",
  }),
  confirmNewPassword: joi.ref("newPassword"),
});
