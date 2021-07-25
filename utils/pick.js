module.exports = (object, keys) => {
  const result = {};
  const objKeys = Object.keys(object);
  objKeys.forEach((key) => {
    if (keys.includes(key)) {
      result[key] = object[key];
    }
  });
  return result;
};
