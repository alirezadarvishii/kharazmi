const openGalleryModalBtns = document.querySelectorAll(".gallery .gallery-image");
const galleryModal = document.querySelector("#galleryImg");
const modalImg = document.querySelector("#galleryImg img");
const modalCaption = document.querySelector("#galleryImg .caption");
const modalLoader = document.querySelector("#galleryImg .spinner-container");

openGalleryModalBtns.forEach((el) =>    
  el.addEventListener("click", (e) => {
    const { imgId } = e.target.dataset;
    galleryModal.dataset.imgId = imgId;
  })
);

galleryModal.addEventListener("show.bs.modal", () => modalLoader.classList.add("active"));
galleryModal.addEventListener("shown.bs.modal", async (e) => {
  const { imgId } = e.target.dataset;
  const getImg = await fetch(`http://localhost:3000/gallery/img/${imgId}`);
  if (getImg.status === 200) {
    const response = await getImg.json();
    modalImg.src = `http://localhost:3000/gallery/${response.img}`;
    modalCaption.textContent = response.caption;
    modalLoader.classList.remove("active");
  } else {
    console.log("Something went wrong!");
  }
});
