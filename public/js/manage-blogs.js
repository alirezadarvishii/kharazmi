const deleteBlogForm = document.querySelectorAll("form.delete-blog");
deleteBlogForm.forEach((el) => {
  el.addEventListener("submit", (e) => {
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
  });
});

const getBlogBtns = document.querySelectorAll(".get-blog");

// Get private blog
const getBlog = async (e) => {
  const { blogId } = e.target.dataset;
  const getBlog = await fetch(`http://localhost:3000/blog/read/private/${blogId}`);
  if (getBlog.status === 200) {
    const response = await getBlog.json();
    const { title, body, tags } = response.blog;
    const blogModalContainer = document.querySelector("#readBlogModal");
    blogModalContainer.querySelector(".modal-title").textContent = title;
    blogModalContainer.querySelector(".modal-body").innerHTML = body;
    blogModalContainer.querySelector(".blog-tags").innerHTML = "";
    tags.forEach((tag) => {
      const li = document.createElement("li");
      li.classList = "bg-light font-light fs-sm me-1 text-dark rounded-3 py-1 px-2";
      li.textContent = `#${tag}`;
      blogModalContainer.querySelector(".blog-tags").appendChild(li);
    });
  } else {
    console.log("Something went wrong!");
  }
};
// Get private blog listener
getBlogBtns.forEach((el) => {
  el.addEventListener("click", getBlog);
});
