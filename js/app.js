const swiper = new Swiper(".blogs-slider", {
  slidesPerView: 3,
  spaceBetween: 25,
  loop: true,
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
});

const mastersSwiper = new Swiper(".masters-slider", {
  slidesPerView: 4,
  spaceBetween: 25,
  loop: true,
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
});

const sessionsSwiper = new Swiper(".sessions-slider", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
});
