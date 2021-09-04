const joi = require("joi");

exports.adminValidation = joi.object({
  fullname: joi.string().trim().required().messages({ "string.empty": "نام و نام خانوادگی الزامیه رفیق!" }),
  email: joi
    .string()
    .email()
    .trim()
    .required()
    .messages({ "string.empty": "ایمیل الزامیه رفیق!", "string.email": "یه ایمیل صحیح وارد کن رفیق!" }),
  phoneNumber: joi.string().trim().required().messages({ "string.empty": "تلفن همراه الزامی است!" }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه رفیق!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه رفیق!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه رفیق!",
  }),
  _csrf: joi.allow(),
});

exports.teacherValidation = joi.object({
  fullname: joi.string().trim().required().messages({ "string.empty": "نام و نام خانوادگی الزامیه رفیق!" }),
  email: joi
    .string()
    .email()
    .trim()
    .required()
    .messages({ "string.empty": "ایمیل الزامیه رفیق!", "string.email": "یه ایمیل صحیح وارد کن رفیق!" }),
  phoneNumber: joi.string().trim().required().messages({ "string.empty": "تلفن همراه الزامی است!" }),
  lesson: joi
    .string()
    .valid("specialist", "general", "both")
    .trim()
    .required()
    .messages({ "string.empty": "زمینه کاری شما الزامی است" }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه رفیق!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه رفیق!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه رفیق!",
  }),
  _csrf: joi.allow(),
});

exports.normalUserValidation = joi.object({
  fullname: joi.string().trim().required().messages({ "string.empty": "نام و نام خانوادگی الزامیه رفیق!" }),
  email: joi
    .string()
    .email()
    .trim()
    .required()
    .messages({ "string.empty": "ایمیل الزامیه رفیق!", "string.email": "یه ایمیل صحیح وارد کن رفیق!" }),
  phoneNumber: joi.string().trim().required().messages({ "string.empty": "تلفن همراه الزامی است!" }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه رفیق!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه رفیق!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه رفیق!",
  }),
  _csrf: joi.allow(),
});

exports.loginValidation = joi.object({
  email: joi
    .string()
    .email()
    .trim()
    .required()
    .messages({ "string.empty": "ایمیل الزامیه رفیق!", "string.email": "یه ایمیل صحیح وارد کن رفیق!" }),
  password: joi.string().trim().required().min(8).max(255).messages({
    "string.empty": "پسوورد الزامیه رفیق!",
    "string.min": "پسوورد باید حدااقل 8 کاراکتر باشه رفیق!",
    "string.max": "پسوورد باید حدااکثر 255 کاراکتر باشه رفیق!",
  }),
  loginType: joi.string().valid("admin", "teacher", "user").required().messages({ "string.empty": "نوع ورود الزامیه" }),
  rememberme: joi.string(),
  "g-recaptcha-response": joi.allow(),
  _csrf: joi.allow(),
});

exports.editUserValidation = joi.object({
  fullname: joi.string().trim().min(5).max(20).required().messages({
    "string.empyt": "نام و نام خانوادگی الزامیه!",
    "string.min": "نام و نام خانوادگی نباید کمتر از 5 کاراکتر باشد!",
    "string.max": "نام و نام خانوادگی نباید بیشتر از 15 کاراکتر باشد!",
  }),
  bio: joi.string().allow("").trim(),
  _csrf: joi.allow(),
});

exports.changePasswordValidation = joi.object({
  currentPassword: joi
    .string()
    .min(8)
    .required()
    .messages({ "string.empty": "فیلد رمز عبور فعلی الزامی است!", "string.min": "رمز عبور فعلی نادرست است!" }),
  newPassword: joi
    .string()
    .min(8)
    .required()
    .messages({
      "string.empty": "فیلد رمز عبور جدید الزامی است!",
      "string.min": "رمز عبور نباید کمتر از 8 کارکتر باشد",
    }),
  confirmNewPassword: joi.ref("newPassword"),
});
