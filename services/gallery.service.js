const path = require("path");

const Gallery = require("../model/gallery");
const downloadFile = require("../shared/download-file");

class GalleryService {
  async find(query, queryOptions = {}) {
    const { slide, IMAGE_PER_PAGE } = queryOptions;
    const option = {
      skip: IMAGE_PER_PAGE * (slide - 1),
      limit: IMAGE_PER_PAGE,
    };
    const galleryImages = await Gallery.find({ ...query }, null, option);
    return galleryImages;
  }

  async findOne(imageId) {
    const image = await Gallery.findOne({ _id: imageId });
    return image;
  }

  async addNewImg(imgDto) {
    const filename = `${Date.now()}.jpeg`;
    const option = {
      buffer: imgDto.buffer,
      path: path.join(__dirname, "..", "public", "gallery", filename),
      quality: 60,
    };
    await downloadFile(option);
    const result = await Gallery.create({ ...imgDto, img: filename });
    return result;
  }

  async editImg(imgId, imgDto) {
    const img = await Gallery.findOne({ _id: imgId });
    if (imgDto.galleryImg) {
      await downloadFile({
        path: path.join(__dirname, "..", "public", "gallery", img.img),
        quality: 60,
        buffer: imgDto.img,
      });
    }
    if (imgDto.caption) img.caption = imgDto.caption;
    await img.save();
  }

  async deleteImg(imgId) {
    const result = await Gallery.deleteOne({ _id: imgId });
    return result;
  }

  async countDocuments() {
    const length = await Gallery.countDocuments();
    return length;
  }
}

module.exports = new GalleryService();
