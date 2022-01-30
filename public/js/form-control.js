const filterForm = document.querySelector("form#filter-form");
const paginationItems = document.querySelectorAll(".pagination li a");
const filterInputs = filterForm.querySelectorAll(".filter-form-input");

const filter = () => {
  filterForm.submit();
};

filterInputs.forEach((el) => {
  el.addEventListener("change", filter);
});
