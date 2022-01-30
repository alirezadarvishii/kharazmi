const csrfToken = document.querySelector("meta[name=csrf-token]").getAttribute("content");

class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    
    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    xhr.open("POST", "http://localhost:3000/blog/image/upload", true);
    xhr.setRequestHeader("CSRF-Token", csrfToken);
    xhr.responseType = "json";
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;

      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      //
      // Your integration may handle upload errors in a different way so make sure
      // it is done properly. The reject() function must be called when the upload fails.
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve({
        default: response.url,
      });
    });

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file) {
    // Prepare the form data.
    const data = new FormData();
    data.append("blogImg", file);

    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.

    // Send the request.
    this.xhr.send(data);
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader);
  };
}

const addPostFrom = document.querySelector("form");
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

let ck;
ClassicEditor.create(document.querySelector("#ckeditor"), {
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
<<<<<<< HEAD
<<<<<<< HEAD
  extraPlugins: [MyCustomUploadAdapterPlugin],
=======
=======
>>>>>>> develop
  toolbar: {
    items: ["heading", "|", "bold", "italic", "link", "|", "fontSize", "fontColor", "|", "imageUpload", "blockQuote", "insertTable", "undo", "redo", "codeBlock"],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  simpleUpload: {
    // The URL that the images are uploaded to.
    uploadUrl: "/blog/blogImg",
    headers: {
      "CSRF-Token": csrfToken,
    },
  },
<<<<<<< HEAD
>>>>>>> develop
=======
>>>>>>> develop
})
  .then((editor) => {
    ck = editor;
    // editor.model.document.on("change:data", (x, y) => {});
  })
  .catch((error) => {
    console.error(error);
  });

// Generate validation error feedback element;
const genErrorFeedback = (message) => {
  const errorFeedback = document.createElement("div");
  errorFeedback.classList = "invalid-feedback d-block w-100 font-medium";
  errorFeedback.textContent = message;
  return errorFeedback;
};

const formValidation = (e) => {
  const title = document.querySelector("form [name=title]");
  const category = document.querySelector("form [name=category]");
  const blogImg = document.querySelector("form [name=blogImg]");
  const tags = document.querySelector("form [name=tags]");
  const description = document.querySelector("form [name=description]");
  const body = ck.data.get();

  const validator = new FastestValidator();
  const schema = {
    title: { type: "string", empty: false, messages: { stringEmpty: "تیتر پست الزامی است!" } },
    category: { type: "string", empty: false, messages: { stringEmpty: "دسته بندی پست الزامی است!" } },
    blogImg: { type: "string", empty: false, messages: { stringEmpty: "تصویر پست الزامی است!" } },
    tags: {
      type: "array",
      items: "string",
      unique: true,
      min: 2,
      messages: { arrayMin: "حدااقل 2 تگ الزامی است!", arrayUnique: "تگ ها باید متفاوت باشند!" },
    },
    description: { type: "string", min: 20, messages: { stringMin: "دسکریپشن حدااقل 20 کاراکتر باشد!", stringMax: "دسکریپشن حدااکثر 50 کاراکتر باشد!" } },
    body: { type: "string", min: 200, messages: { stringMin: "متن پست حدااقل 200 کاراکتر باشد!" } },
  };
  const check = validator.compile(schema);
  const validate = check({
    title: title.value,
    category: category.value,
    blogImg: blogImg.value,
    tags: tags.value.split("/").filter((item) => item.length !== 0),
    description: description.value,
    body,
  });
  document.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
  document.querySelectorAll("form .form-control").forEach((el) => el.classList.remove("border-danger"));
  console.log(validate);
  if (validate !== true) {
    e.preventDefault();
    validate.forEach((err) => {
      const input = document.querySelector(`form [name=${err.field}]`);
      input.classList.add("border-danger");
      const errorFeedback = genErrorFeedback(err.message);
      input.closest("div").appendChild(errorFeedback);
    });
  }
};

addPostFrom.addEventListener("submit", formValidation);
