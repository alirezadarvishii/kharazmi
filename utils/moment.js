const jalaliMoment = require("jalali-moment");

exports.moment = (date) => jalaliMoment(date).locale("fa").format("D MMM YYYY");
exports.momentTime = (time) => jalaliMoment(time).locale("fa").format("HH:mm:ss");
