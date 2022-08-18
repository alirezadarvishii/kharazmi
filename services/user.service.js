const path = require("path");

const User = require("../model/user");
const ErrorResponse = require("../utils/ErrorResponse");
const downloadFile = require("../shared/download-file");
const { compare, hash } = require("bcrypt");

class UserService {
  async create(userDto) {
    const result = await User.create(userDto);
    return result;
  }

  async getUsers(query, queryOptions) {
    const users = await User.find({ ...query }, null, queryOptions);
    return users;
  }

  async getUser(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async approve(userId) {
    await User.updateOne({ _id: userId }, { $set: { status: "approved" } });
  }

  async unApprove(userId) {
    await User.updateOne({ _id: userId }, { $set: { status: "unApproved" } });
  }

  async updateProfile(userId, userDto) {
    const user = await User.findOne({ _id: userId });
    if (!user)
      throw new ErrorResponse(
        402,
        "مشکلی پیش آمده، لطفا بعدا تلاش کنید!",
        "back",
      );
    if (userDto.buffer !== undefined) {
      await downloadFile({
        quality: 60,
        filename: user.profileImg,
        path: path.join(__dirname, "..", "public", "users", user.profileImg),
      });
    }
    user.fullname = userDto.fullname;
    user.bio = userDto.bio;
    await user.save();
    return user;
  }

  async updateOne(userId, query) {
    await User.updateOne({ _id: userId }, { ...query });
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findOne({ _id: userId });
    const isMatchPassword = await compare(currentPassword, user.password);
    if (isMatchPassword) {
      const hashPassword = await hash(newPassword, 12);
      user.password = hashPassword;
      await user.save();
      return user;
    }
    throw new ErrorResponse(401, "رمز عبور فعلی نادرست است!", "back");
  }

  async deleteAccount(userId) {
    const result = await User.deleteOne({ _id: userId });
    return result;
  }

  async countDocuments(query) {
    const length = await User.countDocuments({ ...query });
    return length;
  }
}

module.exports = new UserService();
