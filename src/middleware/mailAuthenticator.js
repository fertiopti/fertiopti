  const nodemailer = require("nodemailer");
  const dotenv = require("dotenv");
  const logger = require("../../logger.js")
  dotenv.config();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  function mailAuthenticator(toMail,subject,content) {
      const mailOptions = {
          from: process.env.EMAIL,
          to: toMail,
          subject: subject,
          text: content,
        };
        transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.warn("Error sending email: ", error);
    } else {
      logger.info("Email sent: ", info.response);
      return true
    }
  });
  }

  module.exports = mailAuthenticator;



