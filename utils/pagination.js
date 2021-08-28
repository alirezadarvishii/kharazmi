module.exports = (itemsPerPage, totalLength) => {
  const numberOfSlides = Math.ceil(totalLength / itemsPerPage);
  const pagination = [];
  for (let i = 1; i <= numberOfSlides; i++) {
    pagination.push(i);
  }
  return pagination;
};
