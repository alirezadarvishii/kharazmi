//! Variables
const addNewImageForm = document.querySelector("form#addNewImageForm");
const editImageForm = document.querySelector("form#editImageForm");
const deleteImageForm = document.querySelectorAll("form.delete-image");
const editImageBtn = document.querySelectorAll(".edit-img-btn");

//! Functions
const deleteImage = (e) => {
  e.preventDefault();
  Swal.fire({
    title: "احتیاط!",
    text: "از حذف این تصویر مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "بله، مطمئنم",
    cancelButtonText: "لغو عملیات",
  }).then(async (result) => {
    if (result.isConfirmed) e.target.closest("form").submit();
  });
};

// Generate validation error feedback element;
const genErrorFeedback = (message) => {
  const errorFeedback = document.createElement("div");
  errorFeedback.classList = "invalid-feedback d-block w-100 font-medium";
  errorFeedback.textContent = message;
  return errorFeedback;
};

const formValidation = (e, editImageOperation = false) => {
  const image = e.target
    .closest("form")
    .querySelector("input[name=galleryImg]");
  const caption = e.target
    .closest("form")
    .querySelector("textarea[name=caption]");

  const validator = new FastestValidator();
  const schema = {
    galleryImg: {
      type: "string",
      empty: false,
      messages: { stringEmpty: "آپلود تصویر الزامی است!" },
    },
    caption: {
      type: "string",
      empty: false,
      messages: { stringEmpty: "توضیحات الزامی است!" },
    },
  };
  if (editImageOperation) schema.galleryImg.empty = true;
  const check = validator.compile(schema);
  const validate = check({ galleryImg: image.value, caption: caption.value });
  document.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
  e.target
    .closest("form")
    .querySelectorAll(".border-danger")
    .forEach((el) => el.classList.remove("border-danger"));
  console.log(validate);
  if (validate !== true) {
    e.preventDefault();
    validate.forEach((err) => {
      const input = e.target
        .closest("form")
        .querySelector(`[name=${err.field}]`);
      input.classList.add("border-danger");
      const errorFeedback = genErrorFeedback(err.message);
      input.closest("div").appendChild(errorFeedback);
    });
  }
};

const changeImgIdInputValue = (e) => {
  const { imgId } = e.target.dataset;
  document.querySelector("form#editImageForm input[name=imgId]").value = imgId;
};

//! EventListeners
addNewImageForm.addEventListener("submit", formValidation);
editImageForm.addEventListener("submit", (e) => formValidation(e, true));
deleteImageForm.forEach((el) => el.addEventListener("submit", deleteImage));
editImageBtn.forEach((el) =>
  el.addEventListener("click", changeImgIdInputValue),
);
