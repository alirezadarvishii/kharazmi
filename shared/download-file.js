const sharp = require("sharp");
const httpStatus = require("http-status");

const ApiError = require("../errors/ApiError");

const downloadFile = async (options) => {
  const { buffer, path, quality } = options;
  const result = await sharp(buffer)
    .jpeg({ quality })
    .toFile(path)
    .then((res) => {
      return res;
    })
    .catch(() => {
      throw new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        code: httpStatus[400],
        message: "خطایی در بارگیری تصویر بوجود آمده است!",
        redirectionPath: "back",
      });
    });
  return result;
};

module.exports = downloadFile;
