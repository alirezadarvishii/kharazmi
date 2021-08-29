//! Variables
const deleteImageForm = document.querySelectorAll("form.delete-image");

//! Functions
const deleteImage = (e) => {
  e.preventDefault();
  Swal.fire({
    title: "احتیاط!",
    text: "از حذف این تصویر مطمئن هستید؟",
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

//! EventListeners
deleteImageForm.forEach((el) => el.addEventListener("submit", deleteImage));
