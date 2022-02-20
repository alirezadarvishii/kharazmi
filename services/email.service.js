const nodemailer = require("nodemailer");

class EmailService {
  constructor(email, subject, html) {
    this.email = email;
    this.subject = subject;
    this.html = html;
  }

  async sendEmail() {
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0390e79098b695",
        pass: "d7298a80bb737b",
      },
    });
    const result = await transport.sendMail({
      from: "kharazmi.school@info.com",
      to: this.email,
      subject: this.subject,
      html: this.html,
    });

    return result;
  }
}

module.exports = EmailService;
