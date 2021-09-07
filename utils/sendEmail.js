const nodemailer = require("nodemailer");

module.exports = async (email, subject, html) => {
  // Create email transporter.
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0390e79098b695",
      pass: "d7298a80bb737b",
    },
  });
  // Send email process.
  return await transport.sendMail({
    from: "kharazmi.school@info.com",
    to: email,
    subject,
    html,
  });
};
