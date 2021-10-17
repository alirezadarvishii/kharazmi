const deleteAccountForm = document.querySelector("form#delete-account");
deleteAccountForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const randomNumber = Math.floor(Math.random() * 999999 + 1);
  const { value: enteredNumber } = await Swal.fire({
    icon: "warning",
    title: "آیا از انجام این کار اطمینان دارید؟",
    html: `<p class="text-secondary">لطفا برای احراز هویت عدد مقابل را وارد کنید: <span class="text-danger font-black">${randomNumber}</span></p>`,
    input: "text",
    inputPlaceholder: "عدد را وارد کنید!",
    confirmButtonText: "انجام عملیات",
  });
  if (enteredNumber === randomNumber.toString()) {
    deleteAccountForm.submit();
  } else {
    Swal.fire({
      icon: "error",
      title: "عدد وارد شده اشتباه بود!",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }
});
