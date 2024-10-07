const userModel = require("./user.model");
const logger = require("../../logger");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      logger.error(`Error getting all users: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateUser: async (req, res) => {
    logger.info("User Updated");
    const userId = req.params.userId; // Assuming you have the user ID in the request parameters
    const updatedData = req.body; // Assuming the updated data is sent in the request body
    try {
      const userExists = await userModel.checkUserExists(
        updatedData.email,
        updatedData.phone
      );
      if (userExists) {
        logger.warn(
          `User with the same email or phone already exists.${email},${phone}`
        );
        return res.status(400).json({
          message: "User with the same email or phone already exists.",
        });
      }

      await userModel.updateUser(userId, updatedData);
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getUserInfo: async (req, res) => {
    const userId = req.params.userId;
    console.log(userId); // Assuming you have the user ID in the request parameters
    try {
      const userinfo = await userModel.getUserInfo(userId);
      res.status(200).json(userinfo);
    } catch (error) {
      console.log(error);
      logger.error(`Error viewing user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.userId;
    console.log(userId); // Assuming you have the user ID in the request parameters
    try {
      const userinfo = await userModel.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      logger.error(`Error viewing user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  email_alert_active: async (req, res) => {
    const email = req.body.email;
    console.log(email); // Assuming you have the user ID in the request parameters
    try {
      const userinfo = await userModel.emailAlertActive(email);
      res.status(200).json({ message: "Email Alert activated successfully" });
    } catch (error) {
      console.log(error);
      logger.error(`Error viewing user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  email_alert_deactive: async (req, res) => {
    const email = req.body.email;
    console.log(email); // Assuming you have the user ID in the request parameters
    try {
      const userinfo = await userModel.emailAlertDeactive(email);
      res.status(200).json({ message: "Email Alert deactivated successfully" });
    } catch (error) {
      console.log(error);
      logger.error(`Error viewing user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = userController;
