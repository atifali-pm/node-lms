const nodemailer = require("nodemailer");

const sendEmail = async (data, req, res) => {
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASS,
      }
  });
  let info = await transporter.sendMail({
      from: "Atif Ali",
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
  });
  console.log("Message send: ", info.messageId);
  console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;