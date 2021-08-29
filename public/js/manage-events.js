//! Variables
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

//! EventListeners
editEventModal.addEventListener("shown.bs.modal", editEvent);
editEventBtns.forEach((el) => el.addEventListener("click", changeEventInputValue));
deleteEventForm.forEach((el) => el.addEventListener("submit", deleteEvent));
