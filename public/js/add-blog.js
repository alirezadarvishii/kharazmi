const addPostFrom = document.querySelector("form");

let ck;
ClassicEditor.create(document.querySelector("#ckeditor"), {
  language: "fa",
  heading: {
    options: [
      { model: "paragraph", title: "پاراگراف", class: "ck-heading_paragraph" },
      { model: "heading1", view: "h1", title: "تیتر نویس 1", class: "ck-heading_heading1" },
      { model: "heading2", view: "h2", title: "تیتر نویس 2", class: "ck-heading_heading2" },
      { model: "heading3", view: "h3", title: "تیتر نویس 3", class: "ck-heading_heading3" },
      { model: "heading4", view: "h4", title: "تیتر نویس 4", class: "ck-heading_heading3" },
      { model: "heading5", view: "h5", title: "تیتر نویس 5", class: "ck-heading_heading3" },
      { model: "heading6", view: "h6", title: "تیتر نویس 6", class: "ck-heading_heading3" },
    ],
  },
})
  .then((editor) => {
    ck = editor;
    // editor.model.document.on("change:data", (x, y) => {});
  })
  .catch((error) => {
    console.error(error);
  });

// Generate validation error feedback element;
const genErrorFeedback = (message) => {
  const errorFeedback = document.createElement("div");
  errorFeedback.classList = "invalid-feedback d-block w-100 font-medium";
  errorFeedback.textContent = message;
  return errorFeedback;
};

const formValidation = (e) => {
  const title = document.querySelector("form [name=title]");
  const category = document.querySelector("form [name=category]");
  const blogImg = document.querySelector("form [name=blogImg]");
  const tags = document.querySelector("form [name=tags]");
  const body = ck.data.get();

  const validator = new FastestValidator();
  const schema = {
    title: { type: "string", empty: false, messages: { stringEmpty: "تیتر پست الزامی است!" } },
    category: { type: "string", empty: false, messages: { stringEmpty: "دسته بندی پست الزامی است!" } },
    blogImg: { type: "string", empty: false, messages: { stringEmpty: "تصویر پست الزامی است!" } },
    tags: {
      type: "array",
      items: "string",
      unique: true,
      min: 2,
      messages: { arrayMin: "حدااقل 2 تگ الزامی است!", arrayUnique: "تگ ها باید متفاوت باشند!" },
    },
    body: { type: "string", min: 200, messages: { stringMin: "متن پست حدااقل 200 کاراکتر باشد!" } },
  };
  const check = validator.compile(schema);
  const validate = check({
    title: title.value,
    category: category.value,
    blogImg: blogImg.value,
    tags: tags.value.split("/").filter((item) => item.length !== 0),
    body,
  });
  document.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
  document.querySelectorAll("form .form-control").forEach((el) => el.classList.remove("border-danger"));
  console.log(validate);
  if (validate !== true) {
    e.preventDefault();
    validate.forEach((err) => {
      const input = document.querySelector(`form [name=${err.field}]`);
      input.classList.add("border-danger");
      const errorFeedback = genErrorFeedback(err.message);
      input.closest("div").appendChild(errorFeedback);
    });
  }
};

addPostFrom.addEventListener("submit", formValidation);
