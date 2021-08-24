const openGalleryModalBtns = document.querySelectorAll(".gallery-slider .swiper-slide");
const galleryModal = document.querySelector("#galleryImg");
const modalImg = document.querySelector("#galleryImg img");
const modalCaption = document.querySelector("#galleryImg .caption");
const modalLoader = document.querySelector("#galleryImg .spinner-container");

const blogSlider = new Swiper(".blogs", {
  slidesPerView: 4,
  spaceBetween: 20,
  loop: !0,
  autoplay: { delay: 3e3, disableOnInteraction: !0 },
  navigation: { nextEl: ".next-slide", prevEl: ".prev-slide" },
  breakpoints: { 320: { slidesPerView: 1 }, 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 }, 1400: { slidesPerView: 4 } },
});
const mastersSlider = new Swiper(".masters-slider", {
  slidesPerView: 4,
  spaceBetween: 25,
  loop: !0,
  autoplay: { delay: 3e3, disableOnInteraction: !0 },
  navigation: { nextEl: ".next-slide", prevEl: ".prev-slide" },
  breakpoints: {
    320: { slidesPerView: 1 },
    567: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1400: { slidesPerView: 4 },
  },
});
const eventsSlider = new Swiper(".events-slider", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: !0,
  // autoplay: { delay: 3e3, disableOnInteraction: !0 },
  navigation: { nextEl: ".next-slide", prevEl: ".prev-slide" },
});
const gallerySlider = new Swiper(".gallery-slider", {
  spaceBetween: 25,
  autoplay: { delay: 3e3, disableOnInteraction: !0 },
  navigation: { nextEl: ".next-slide", prevEl: ".prev-slide" },
  breakpoints: { 320: { slidesPerView: 1 }, 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
});

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
galleryModal.addEventListener("hidden.bs.modal", () => {
  modalCaption.textContent = "";
  modalImg.src = "";
});
