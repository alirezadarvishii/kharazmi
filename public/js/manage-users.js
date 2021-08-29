//! Variables
const deleteUserForm = document.querySelectorAll("form.delete-user");

//! Functions
const deleteUser = (e) => {
  e.preventDefault();
  Swal.fire({
    title: "احتیاط!",
    text: "از حذف این پست مطمئن هستی؟",
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

//! Eventlisteners
deleteUserForm.forEach((el) => el.addEventListener("submit", deleteUser));
