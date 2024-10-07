const logger = require("../../logger");
const mailAuthenticator = require("../middleware/mailAuthenticator");

const communicationController = {

  sendEmail: async (req, res) => {
    const { toMail, subject, message } = req.body;
    try {
      const mailer = await mailAuthenticator(toMail, subject, message);
      logger.info(`email sent : ${toMail}`);
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error Controller" });
    }
  },
};

module.exports = communicationController;
