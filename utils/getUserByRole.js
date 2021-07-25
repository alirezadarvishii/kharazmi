const Admin = require("../model/admin");
const Teacher = require("../model/teachers");
const User = require("../model/user");

module.exports = async (role, identity) => {
  if (role === "admin") {
    return await Admin.findOne(identity);
  } else if (role === "teacher") {
    return await Teacher.findOne(identity);
  } else {
    return await User.findOne(identity);
  }
};
