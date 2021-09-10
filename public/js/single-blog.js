//! Variabales
const addCommentCkEditor = document.querySelector("#addCommentCkeditor");
const editCommentCkEditor = document.querySelector("#editComment textarea");
const replyCommentCkEditor = document.querySelector("#replyCommentCkeditor");
const editCommentModal = document.querySelector("#editComment");
const likeBtn = document.querySelector(".like-blog");
const likeNumber = document.querySelector(".likes .like-number");
const addCommentBtn = document.querySelectorAll("button.add-comment");

// Ckeditor config.
const ckEditorConfig = {
  language: "fa",
  heading: {
    options: [
      { model: "paragraph", title: "پاراگراف", class: "ck-heading_paragraph" },
      { model: "heading1", view: "h1", title: "تیتر نویس 1", class: "ck-heading_heading1" },
      { model: "heading2", view: "h2", title: "تیتر نویس 2", class: "ck-heading_heading2" },
      { model: "heading3", view: "h3", title: "تیتر نویس 3", class: "ck-heading_heading3" },
      { model: "heading4", view: "h4", title: "تیتر نویس 4", class: "ck-heading_heading3" },
      { model: "heading5", view: "h5", title: "تیتر نویس 5", class: "ck-heading_heading3" },
      { model: "heading6", view: "h6", title: "تیتر نویس 6", class: "ck-heading_heading3" },
    ],
  },
};
let editCommentCK;
// Ckeditors initialize.
ClassicEditor.create(editCommentCkEditor, ckEditorConfig)
  .then((res) => (editCommentCK = res))
  .catch((err) => console.log(err));
ClassicEditor.create(addCommentCkEditor, ckEditorConfig)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
ClassicEditor.create(replyCommentCkEditor, ckEditorConfig)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

//! Functions
const spinner = () => {
  const spinner = document.createElement("span");
  spinner.classList = "spinner-border spinner-border-sm ms-1";
  return spinner;
};

// Like blog function
const like = async () => {
  const { blogId } = likeBtn.dataset;
  const likeBlog = await fetch(`http://localhost:3000/blog/like/${blogId}`);
  console.log(likeBlog);
  if (likeBlog.status === 200) {
    const response = await likeBlog.json();
    likeNumber.textContent = response.blogLikesLength;
    if (!likeBtn.classList.contains("liked")) {
      likeBtn.classList.add("liked");
    } else {
      likeBtn.classList.remove("liked");
    }
  } else if (likeBlog.status === 401) {
    Swal.fire({
      titleText: "خــطــا!",
      text: "لطفا ابتدا وارد حساب کاربری خود شوید",
      footer: "هنرستان خوارزمی فیروزآباد",
      icon: "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      titleText: "خــطــا!",
      text: "مشکلی پیش آمده، لطفا دوباره تلاش کنید!",
      footer: "هنرستان خوارزمی فیروزآباد",
      icon: "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
};

// Add a new comment confirmation function.
const addComment = async (e) => {
  e.target.append(spinner());
};

// Delete a comment
const deleteComment = (e) => {
  Swal.fire({
    title: "از انجام این کار مطمئنی؟",
    text: "مطمئنی که میخوای پاکش کنی؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "آره، مطمئنم",
    cancelButtonText: "نه، لغو عملیات",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const csrfToken = document.querySelector("meta[name=csrfToken]").getAttribute("content");
      const { commentId } = e.target.closest("button").dataset;
      e.target.append(spinner());
      const fetchToDelete = await fetch(`http://localhost:3000/comment/delete`, {
        method: "DELETE",
        body: JSON.stringify({
          commentId,
        }),
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
      });
      if (fetchToDelete.status === 200) {
        const response = await fetchToDelete.json();
        console.log(response);
        loadComments();
        Swal.fire({
          titleText: "مــــوفــــق!",
          text: response.message,
          footer: "هنرستان خوارزمی فیروزآباد",
          icon: "success",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        const error = await fetchToDelete.json();
        Swal.fire({
          titleText: "خــطــا!",
          text: error.message,
          footer: "هنرستان خوارزمی فیروزآباد",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  });
};

// Delete a reply comment
const deleteReplyComment = async (e) => {
  Swal.fire({
    title: "از انجام این کار مطمئنی؟",
    text: "مطمئنی که میخوای پاکش کنی؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "آره، مطمئنم",
    cancelButtonText: "نه، لغو عملیات",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { commentId } = e.target.closest("button").dataset;
      const csrfToken = document.querySelector("meta[name=csrfToken]").getAttribute("content");
      e.target.append(spinner());
      const fetchToDelete = await fetch("http://localhost:3000/comment/delete", {
        method: "DELETE",
        body: JSON.stringify({
          replyId: commentId,
          replyComment: true,
        }),
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
      });
      if (fetchToDelete.status === 200) {
        const response = await fetchToDelete.json();
        e.target.closest("li").remove();
        Swal.fire({
          titleText: "مــوفــق!",
          text: response.message,
          footer: "هنرستان خوارزمی فیروزآباد",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        const error = await fetchToDelete.json();
        Swal.fire({
          titleText: "خــطــا!",
          text: error.message,
          footer: "هنرستان خوارزمی فیروزآباد",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  });
};

// API: Get comment for edit it.
const getCommentForEdit = async () => {
  const commentId = document.querySelector("#editComment input[name=commentId]");
  const replyId = document.querySelector("#editComment input[name=replyId]");
  let url;
  console.log(replyId);
  if (!replyId.value) {
    url = `http://localhost:3000/comment/read/${commentId.value}`;
  } else {
    url = `http://localhost:3000/comment/read/${commentId.value}?replyId=${replyId.value}`;
  }
  const getComment = await fetch(url);
  if (getComment.status === 200) {
    const response = await getComment.json();
    editCommentCK.setData(response.comment.comment);
  } else {
    const error = await getComment.json();
    console.log(error);
  }
};

const openEditCommentModal = (e) => {
  const { commentId, replyId } = e.target.closest("button").dataset;
  document.querySelector("#editComment input[name=commentId]").value = commentId;
  if (replyId) document.querySelector("#editComment input[name=replyId]").value = replyId;
};

const changeReplyCommentInputValue = (e) => {
  const { commentId } = e.target.closest("button").dataset;
  const commentIdInput = document.querySelector("#replyComment input[name=replyId]");
  commentIdInput.value = commentId;
};

const editComment = (e) => {
  e.target.append(spinner());
};

let currentCommentsPage = 1;
const loadComments = async () => {
  const blogId = window.location.pathname.split("/")[3];
  const fetchComments = await fetch(`http://localhost:3000/comment/${blogId}?slide=${currentCommentsPage}`);
  if (fetchComments.status === 200) {
    const response = await fetchComments.json();
    const commentsContainer = document.querySelector(".comments-area .comments");
    const parser = new DOMParser();
    commentsContainer.innerHTML = "";
    if (response.commentsLength >= 1) {
      const cmDOC = parser.parseFromString(response.commentsUI, "text/html").querySelector("ul");
      commentsContainer.append(cmDOC);
      if (response.commentsPerPage * currentCommentsPage < response.commentsLength) {
        const button = document.createElement("button");
        button.classList = "btn btn-secondary mb-4 d-block";
        button.id = "paginate-comments";
        button.textContent = "خواندن کامنت های بیشتر...";
        commentsContainer.append(button);
        button.addEventListener("click", () => {
          currentCommentsPage += 1;
          loadComments();
        });
      }
      const replyCommentBtns = document.querySelectorAll(".reply-comment");
      const deleteCommentBtns = document.querySelectorAll(".delete-comment");
      const deleteReplyCommentBtns = document.querySelectorAll(".delete-reply-comment");
      const editCommentBtn = document.querySelector(".edit-comment");
      const editCommentModalOpener = document.querySelectorAll(".edit-comment-modal-opener");

      deleteCommentBtns.forEach((el) => el.addEventListener("click", deleteComment));
      deleteReplyCommentBtns.forEach((el) => el.addEventListener("click", deleteReplyComment));
      editCommentBtn.addEventListener("click", editComment);
      editCommentModalOpener.forEach((el) => el.addEventListener("click", openEditCommentModal));
      replyCommentBtns.forEach((el) => el.addEventListener("click", changeReplyCommentInputValue));
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    } else {
      const cmDOC = parser.parseFromString(response.commentsUI, "text/html").querySelector("div");
      commentsContainer.append(cmDOC);
    }
    document.querySelector(".blog-feedbacks .comments span").textContent = response.commentsLength;
  } else {
    console.log("Something went wrong!");
  }
};

const closeEditModal = () => {
  editCommentModal.querySelector("input[name=replyId]").value = "";
};

//! EventListeners
document.addEventListener("DOMContentLoaded", loadComments);

likeBtn.addEventListener("click", like);
editCommentModal.addEventListener("shown.bs.modal", getCommentForEdit);
editCommentModal.addEventListener("hidden.bs.modal", closeEditModal);
addCommentBtn.forEach((el) => el.addEventListener("click", addComment));
