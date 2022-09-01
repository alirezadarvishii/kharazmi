const editImageBtn = document.querySelectorAll(".edit-img-btn");
const editImgModal = document.querySelector("#editImgModal");
const caption = document.querySelector("#editImgModal textarea[name=caption]");
const loader = document.querySelector("#editImgModal .spinner-container");

editImageBtn.forEach((el) =>
  el.addEventListener("click", (e) => {
    loader.classList.add("active");
    const { imgId } = e.target.dataset;
    document.querySelector("#editImgModal input[name=imgId]").value = imgId;
  })
);

editImgModal.addEventListener("shown.bs.modal", async () => {
  const img = document.querySelector("#editImgModal input[name=galleryImg]");
  const imgId = document.querySelector("#editImgModal input[name=imgId]");
  const formData = new FormData();
  formData.append("galleryImg", img.files[0]);
  formData.append("caption", caption.value);
  const getImg = await fetch(`http://localhost:3000/gallery/img/${imgId.value}`);
  if (getImg.status === 200) {
    loader.classList.remove("active");
    const response = await getImg.json();
    caption.value = response.caption;
  } else {
    console.log("Something went wrong!");
  }
});

editImgModal.addEventListener("hidden.bs.modal", () => {
  caption.value = "";
});
