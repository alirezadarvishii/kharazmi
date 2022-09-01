// Config persian date and time picker.
$(document).ready(function () {
  const handleClosedDays = () => {
    const closedDays = document.querySelectorAll(".datepicker-plot-area .datepicker-day-view .table-days tr");
    closedDays.forEach((el) => {
      if (!el.children[6].children[0].classList.contains("other-month")) {
        el.children[6].children[0].style.color = "#ff4343";
      }
    });
  };
  $("input.date").persianDatepicker({
    navigator: {
      onNext: () => handleClosedDays(),
      onPrev: () => handleClosedDays(),
    },
    format: "DD MMMM YYYY",
  });
  handleClosedDays();
  $(".only-time-picker").persianDatepicker({
    onlyTimePicker: true,
    format: "HH:mm",
    calendar: {
      persian: {
        locale: "en",
      },
    },
    initialValue: false,
  });
});

//! Variables
const addNewEventForm = document.querySelector("form#addNewEventForm");
const editEventForm = document.querySelector("form#editEventForm");
const editEventModal = document.querySelector("#editEventModal");
const editEventBtns = document.querySelectorAll(".edit-event");
const deleteEventForm = document.querySelectorAll("form.delete-event");

//! Functions
const changeEventInputValue = (e) => {
  const { eventId } = e.target.closest("a").dataset;
  document.querySelector("#editEventModal input[name=eventId]").value = eventId;
};

const deleteEvent = (e) => {
  e.preventDefault();
  Swal.fire({
    title: "احتیاط!",
    text: "از حذف این رویداد مطمئن هستید؟",
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

const editEvent = async () => {
  const eventId = editEventModal.querySelector("input[name=eventId]").value;
  const getEvent = await fetch(`http://localhost:3000/event/${eventId}`);
  if (getEvent.status === 200) {
    const { title, start, time, description } = await getEvent.json();
    editEventModal.querySelector("input[name=title]").value = title;
    editEventModal.querySelector("input[name=start]").value = start;
    editEventModal.querySelector("input[name=time]").value = time;
    editEventModal.querySelector("textarea[name=description]").value = description;
  } else {
    const error = await getEvent.json();
    console.log(error);
  }
};

// Generate validation error feedback element;
const genErrorFeedback = (message) => {
  const errorFeedback = document.createElement("div");
  errorFeedback.classList = "invalid-feedback d-block w-100 font-medium";
  errorFeedback.textContent = message;
  return errorFeedback;
};

const formValidation = (e) => {
  const title = e.target.closest("form").querySelector("input[name=title]");
  const eventImg = e.target.closest("form").querySelector("input[name=eventImg]");
  const start = e.target.closest("form").querySelector("input[name=start]");
  const description = e.target.closest("form").querySelector("textarea[name=description]");

  const validator = new FastestValidator();
  const schema = {
    title: { type: "string", empty: false, messages: { stringEmpty: "تیتر رویداد الزامی است!" } },
    eventImg: { type: "string", empty: false, messages: { stringEmpty: "تصویر رویداد الزامی است!" } },
    start: { type: "string", empty: false, messages: { stringEmpty: "تاریخ الزامی است!" } },
    description: { type: "string", min: 50, messages: { stringMin: "توضیحات حدااقل باید 50 کاراکتر باشد!" } },
  };
  const check = validator.compile(schema);
  const validate = check({
    title: title.value,
    eventImg: eventImg.value,
    start: start.value,
    description: description.value,
  });
  document.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
  e.target
    .closest("form")
    .querySelectorAll(".border-danger")
    .forEach((el) => el.classList.remove("border-danger"));
  console.log(validate);
  if (validate !== true) {
    e.preventDefault();
    validate.forEach((err) => {
      const input = e.target.closest("form").querySelector(`[name=${err.field}]`);
      input.classList.add("border-danger");
      const errorFeedback = genErrorFeedback(err.message);
      input.closest("div").appendChild(errorFeedback);
    });
  }
};

//! EventListeners
addNewEventForm.addEventListener("submit", formValidation);
editEventModal.addEventListener("shown.bs.modal", editEvent);
editEventBtns.forEach((el) => el.addEventListener("click", changeEventInputValue));
deleteEventForm.forEach((el) => el.addEventListener("submit", deleteEvent));
