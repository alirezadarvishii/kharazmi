const path = require("path");

const ejs = require("ejs");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");

const Admin = require("../model/admin");
const Teacher = require("../model/teacher");
const User = require("../model/user");
const ErrorResponse = require("../utils/ErrorResponse");
const checkEmailExist = require("../utils/checkEmailExist");
const { hash, compare } = require("bcrypt");
const getUserByRole = require("../utils/getUserByRole");
const EmailService = require("./email.service");

class AuthService {
  async registerAdmin(adminDto) {
    const { email, password, profileImg } = adminDto;
    const checkEmail = await checkEmailExist(email);
    if (checkEmail.includes(true)) {
      return new ErrorResponse(402, "یک کاربر با این ایمیل موجود است!", "back");
    }
    const hashPassword = await hash(password, 12);
    const filename = `${Date.now()}.jpeg`;
    await sharp(profileImg.buffer)
      .jpeg({ quality: 60 })
      .toFile(path.join(__dirname, "..", "public", "users", filename));

    const adminUsersLength = await Admin.countDocuments();
    if (adminUsersLength < 1) {
      await Admin.create({
        ...adminDto,
        status: "approved",
        profileImg: filename,
        password: hashPassword,
      });
    } else {
      await Admin.create({
        ...adminDto,
        profileImg: filename,
        password: hashPassword,
      });
    }
  }

  async registerTeacher(teacherDto) {
    const { email, password, profileImg } = teacherDto;
    const checkEmail = await checkEmailExist(email);
    if (checkEmail.includes(true)) {
      return new ErrorResponse(402, "یک کاربر با این ایمیل موجود است!", "back");
    }
    const hashPassword = await hash(password, 12);
    const filename = `${Date.now()}.jpeg`;
    await sharp(profileImg.buffer)
      .jpeg({ quality: 60 })
      .toFile(path.join(__dirname, "..", "public", "users", filename));
    const teacher = {
      teacherDto,
      profileImg: filename,
      password: hashPassword,
    };
    await Teacher.create(teacher);
  }

  async registerUser(userDto) {
    const { email, password, profileImg } = userDto;
    const checkEmail = await checkEmailExist(email);
    if (checkEmail.includes(true)) {
      return new ErrorResponse(402, "یک کاربر با این ایمیل موجود است!", "back");
    }
    const hashPassword = await hash(password, 12);
    const filename = `${Date.now()}.jpeg`;
    await sharp(profileImg.buffer)
      .jpeg({ quality: 60 })
      .toFile(path.join(__dirname, "..", "public", "users", filename));
    const user = {
      userDto,
      profileImg: filename,
      password: hashPassword,
    };
    await User.create(user);
  }

  async login(userDto) {
    const { loginType, email, password } = userDto;
    const user = await getUserByRole(loginType, { email });
    if (!user) {
      throw new ErrorResponse(
        400,
        "ایمیل با پسوورد اشتباه است، بیشتر دقت کنید!",
        "/login",
      );
    }
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ErrorResponse(
        400,
        "ایمیل با پسوورد اشتباه است، بیشتر دقت کنید!",
        "/login",
      );
    }
    if (user.status !== "approved") {
      throw new ErrorResponse(
        403,
        "کاربر گرامی، حساب کاربری شما در حالت تعلیق قرار دارد و باید از سوی مدیریت تأیید شود!",
        "/",
      );
    }
    delete user._doc.password;
    return user;
  }

  async forgetPassword(userDto) {
    const { userType, email } = userDto;
    const user = await getUserByRole(userType, { email });
    if (!user) {
      throw new ErrorResponse(404, "کاربری با این ایمیل یافت نشد!", "back");
    }
    const token = jwt.sign(
      {
        email: user.email,
        userRole: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );
    const filePath = path.join(
      __dirname,
      "..",
      "views",
      "includes",
      "email-reset-password.ejs",
    );
    const resetPasswordTemplate = await ejs.renderFile(filePath, { token });

    await new EmailService(
      email,
      "بازنشانی رمز عبور",
      resetPasswordTemplate,
    ).sendEmail();
  }

  async resetPassword(userDto) {
    const { token, password } = userDto;
    // eslint-disable-next-line fp/no-let
    let jwtToken;
    try {
      jwtToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new ErrorResponse(
        422,
        "توکن نامعتبر، لطفا دوباره از ابتدا تلاش کنید!",
        "/forget-password",
      );
    }
    const { email, userRole } = jwtToken;
    const user = await getUserByRole(userRole, { email });
    const hashedPassword = await hash(password, 12);
    user.password = hashedPassword;
    await user.save();
  }
}

module.exports = AuthService;
