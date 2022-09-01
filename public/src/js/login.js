//! Variables
const loginForm = document.querySelector("form");

//! Functions 
// Generate validation error feedback element;
const genErrorFeedback = (message) => {
  const errorFeedback = document.createElement("div");
  errorFeedback.classList = "invalid-feedback d-block w-100 font-medium";
  errorFeedback.textContent = message;
  return errorFeedback;
};

const formValidation = (e) => {
  const loginType = document.querySelectorAll("form input[name=loginType]");
  const email = document.querySelector("form input[name=email]");
  const password = document.querySelector("form input[name=password]");
  const validator = new FastestValidator();
  const schema = {
    email: {
      type: "email",
      messages: {
        emailEmpty: "فیلد ایمیل الزامی است!",
        email: "ایمیل وارد شده صحیح نیست!",
      },
    },
    password: {
      type: "string",
      min: 8,
      messages: {
        required: "فیلد رمز عبور الزامی می باشد!",
        stringMin: "رمز عبور حدااقل باید 8 کاراکتر باشد!",
      },
    },
  };
  const check = validator.compile(schema);
  const validate = check({ email: email.value, password: password.value });
  document.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
  document.querySelectorAll("form input").forEach((el) => el.classList.remove("border-danger"));
  loginType.forEach((el) => el.classList.remove("border-danger"));
  if (validate !== true) {
    e.preventDefault();
    validate.forEach((err) => {
      const input = document.querySelector(`form input[name=${err.field}]`);
      input.classList.add("border-danger");
      const errorFeedback = genErrorFeedback(err.message);
      input.closest("div").appendChild(errorFeedback);
    });
  }
  // Radio buttons validation process.
  const radiosValidation = new Array(...loginType).map((el) => el.checked);
  if (!radiosValidation.includes(true)) {
    e.preventDefault();
    loginType.forEach((el) => el.classList.add("border-danger"));
    const radiosContainer = document.querySelector(".radios-container");
    const errorFeedBack = genErrorFeedback("لطفا نوع کاربری خود را انتخاب کنید!");
    radiosContainer.appendChild(errorFeedBack);
  }
};

//! EventListeners
loginForm.addEventListener("submit", formValidation);
