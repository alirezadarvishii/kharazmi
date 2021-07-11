import "../styles/style.css";
import "../styles/responsive.css";

const swiper = new Swiper(".blogs", {
  slidesPerView: 4,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
    1400: {
      slidesPerView: 4,
    },
  },
});

const mastersSwiper = new Swiper(".masters-slider", {
  slidesPerView: 4,
  spaceBetween: 25,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    567: {
      slidesPerView: 2,
    },
    1400: {
      slidesPerView: 4,
    },
  },
});

const sessionsSwiper = new Swiper(".sessions-slider", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
});

const honorsSlider = new Swiper(".honors-slider", {
  spaceBetween: 25,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
    1400: {
      slidesPerView: 4,
    },
  },
});
