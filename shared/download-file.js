const sharp = require("sharp");

const downloadFile = async (options) => {
  const { buffer, path, quality } = options;
  const result = await sharp(buffer)
    .jpeg({ quality })
    .toFile(path)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("Sharp Error: ", err);
      return err;
    });
  return result;
};

module.exports = downloadFile;
