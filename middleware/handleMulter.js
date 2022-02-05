const multer = require("multer");

// Multer Configs.
const fileFilter = (req, file, cb) => {
  const validMimeType = ["image/png", "image/jpg", "image/jpeg"];
  if (validMimeType.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(null, false);
};

const upload = multer({
  fileFilter,
  limits: { fileSize: 40000000 },
}).fields([
  { name: "profileImg", maxCount: 1 },
  { name: "blogImg", maxCount: 1 },
  { name: "galleryImg", maxCount: 1 },
  { name: "eventImg", maxCount: 1 },
  { name: "upload", maxCount: 5 },
]);

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    return err instanceof multer.MulterError ? next(err) : next();
  });
};
