const registerForm = document.querySelector("form");
const genErrorFeedback = (message) => {
  const errorFeedback = document.createElement("div");
  errorFeedback.classList = "invalid-feedback d-block w-100 font-medium";
  errorFeedback.textContent = message;
  return errorFeedback;
};
const formValidation = (e) => {
  const fullname = document.querySelector("form input[name=fullname]");
  const email = document.querySelector("form input[name=email]");
  const phoneNumber = document.querySelector("form input[name=phoneNumber]");
  const password = document.querySelector("form input[name=password]");
  const validator = new FastestValidator();
  const schema = {
    fullname: { type: "string", empty: false, messages: { stringEmpty: "نام و نام خانوادگی الزامی است!" } },
    email: { type: "email", messages: { emailEmpty: "ایمیل الزامی است!", email: "ایمیل صحیح نیست!" } },
    phoneNumber: {
      type: "string",
      length: "11",
      messages: { stringLength: "تلفن همراه صحیح نیست!" },
    },
    password: {
      type: "string",
      min: 8,
      messages: { stringMin: "رمز عبور حدااقل باید 8 کاراکتر باشد!" },
    },
  };
  const check = validator.compile(schema);
  const validate = check({
    fullname: fullname.value,
    email: email.value,
    phoneNumber: phoneNumber.value,
    password: password.value,
  });
  document.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
  document.querySelectorAll("form input").forEach((el) => el.classList.remove("border-danger"));
  console.log(validate);
  if (validate !== true) {
    e.preventDefault();
    validate.forEach((err) => {
      const input = document.querySelector(`form input[name=${err.field}]`);
      input.classList.add("border-danger");
      const errorFeedback = genErrorFeedback(err.message);
      input.closest("div").appendChild(errorFeedback);
    });
  }
};
registerForm.addEventListener("submit", formValidation);
