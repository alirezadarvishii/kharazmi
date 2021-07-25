const Gallery = require("../model/gallery");

exports.indexPage = async (req, res) => {
  const galleryImages = await Gallery.find({});
  res.render("index", {
    title: "هنرستان کاردانش خوارزمی | ناحیه فیروزآباد",
    galleryImages,
  });
};

exports.gallery = async (req, res) => {};

exports.about = (req, res) => {
  res.render("about", {
    title: "درباره ما",
    headerTitle: "دربـاره مـا",
  });
};
