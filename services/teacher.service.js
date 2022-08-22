const path = require("path");

const httpStatus = require("http-status");
const { compare, hash } = require("bcrypt");

const Teacher = require("../model/teacher");
const downloadFile = require("../shared/download-file");
const ApiError = require("../errors/ApiError");

class TeacherService {
  async create(teacherDto) {
    const result = await Teacher.create(teacherDto);
    return result;
  }

  async getTeachers(query, queryOptions) {
    const teachers = await Teacher.find({ ...query }, null, queryOptions);
    return teachers;
  }

  async getTeacher(teacherId) {
    const teacher = await Teacher.findOne({ _id: teacherId });
    return teacher;
  }

  async findByEmail(email) {
    const teacher = await Teacher.findOne({ email });
    return teacher;
  }

  async approve(userId) {
    await Teacher.updateOne({ _id: userId }, { $set: { status: "approved" } });
  }

  async unApprove(userId) {
    await Teacher.updateOne(
      { _id: userId },
      { $set: { status: "unApproved" } },
    );
  }

  async updateProfile(teacherId, teacherDto) {
    const teacher = await Teacher.findOne({ _id: teacherId });
    if (!teacher) {
      throw new ApiError({
        statusCode: httpStatus.NOT_FOUND,
        code: httpStatus[404],
        message: "کاربر یافت نشد!",
        redirectionPath: "back",
      });
    }
    if (teacherDto.buffer !== undefined) {
      await downloadFile({
        quality: 60,
        filename: teacher.profileImg,
        path: path.join(__dirname, "..", "public", "users", teacher.profileImg),
        buffer: teacherDto.buffer,
      });
    }
    teacher.fullname = teacherDto.fullname;
    teacher.bio = teacherDto.bio;
    await teacher.save();
    return teacher;
  }

  async updateOne(teacherId, query) {
    await Teacher.updateOne({ _id: teacherId }, { ...query });
  }

  async changePassword(teacherId, currentPassword, newPassword) {
    const teacher = await Teacher.findOne({ _id: teacherId });
    const isMatchPassword = await compare(currentPassword, teacher.password);
    if (isMatchPassword) {
      throw new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        code: httpStatus[400],
        message: "رمزعبور فعلی نادرست است!",
        redirectionPath: "back",
      });
    }
    const hashPassword = await hash(newPassword, 12);
    teacher.password = hashPassword;
    await teacher.save();
    return teacher;
  }

  async deleteAccount(userId) {
    await Teacher.deleteOne({ _id: userId });
  }

  async countDocuments(query) {
    const length = await Teacher.countDocuments({ ...query });
    return length;
  }
}

module.exports = new TeacherService();
