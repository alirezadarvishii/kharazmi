const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const User = require("../model/user");

module.exports = (email) => {
  const checkInAdmins = Admin.exists({ email });
  const checkInTeachers = Teacher.exists({ email });
  const checkInUsers = User.exists({ email });
  return Promise.all([checkInAdmins, checkInTeachers, checkInUsers]);
};
