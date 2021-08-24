//! Variables
const editEventModal = document.querySelector("#editEventModal");
const editEventBtns = document.querySelectorAll(".edit-event");

//! Functions
const changeEventInputValue = (e) => {
  const { eventId } = e.target.closest("a").dataset;
  document.querySelector("#editEventModal input[name=eventId]").value = eventId;
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
