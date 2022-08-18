const jalaliMoment = require("jalali-moment");

module.exports.moment = (date) => {
  return jalaliMoment(date).locale("fa").format("D MMM YYYY");
};

module.exports.momentTime = (time) => {
  return jalaliMoment(time).locale("fa").format("HH:mm");
};
