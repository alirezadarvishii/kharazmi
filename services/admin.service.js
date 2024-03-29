const path = require("path");

const httpStatus = require("http-status");

const Admin = require("../model/admin");
const ApiError = require("../lib/ApiError");
const downloadFile = require("../lib/download-file");
const { compare, hash } = require("bcrypt");

class AdminService {
  async create(adminDto) {
    const result = await Admin.create(adminDto);
    return result;
  }

  async getAdmins(query, queryOptions) {
    const admins = await Admin.find({ ...query }, null, queryOptions);
    return admins;
  }

  async getAdmin(adminId) {
    const user = await Admin.findOne({ _id: adminId });
    return user;
  }

  async findByEmail(email) {
    const admin = await Admin.findOne({ email });
    return admin;
  }

  async updateProfile(adminId, adminDto) {
    const admin = await Admin.findOne({ _id: adminId });
    if (!admin)
      throw new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        code: httpStatus[400],
        message: "مشکلی پیش آمده، لطفا بعدا تلاش کنید!",
        redirectionPath: "back",
      });
    if (adminDto.buffer !== undefined) {
      await downloadFile({
        quality: 60,
        filename: admin.profileImg,
        path: path.join(__dirname, "..", "public", "users", admin.profileImg),
        buffer: adminDto.buffer,
      });
    }
    admin.fullname = adminDto.fullname;
    admin.bio = adminDto.bio;
    await admin.save();
    return admin;
  }

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await Admin.findOne({ _id: adminId });
    const isMatchPassword = await compare(currentPassword, admin.password);
    if (!isMatchPassword) {
      throw new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        code: httpStatus[400],
        message: "رمز عبور فعلی نادرست است!",
        redirectionPath: "back",
      });
    }
    const hashPassword = await hash(newPassword, 12);
    admin.password = hashPassword;
    await admin.save();
    return admin;
  }

  async updateOne(adminId, query) {
    await Admin.updateOne({ _id: adminId }, { ...query });
  }

  async deleteAccount(userId) {
    await Admin.deleteOne({ _id: userId });
  }

  async approve(userId) {
    await Admin.updateOne({ _id: userId }, { $set: { status: "approved" } });
  }

  async unApprove(userId) {
    await Admin.updateOne({ _id: userId }, { $set: { status: "notApproved" } });
  }

  async countDocuments(query) {
    const length = await Admin.countDocuments({ ...query });
    return length;
  }
}

module.exports = new AdminService();
