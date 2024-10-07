const authModel = require("./auth.model");
const logger = require("../../logger");
const jwt = require("jsonwebtoken");
const mailAuthenticator = require("../middleware/mailAuthenticator");

const userController = {
  signup: async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
      // Check if the user already exists
      const userExists = await authModel.checkUserExists(email, phone);
      if (userExists) {
        logger.warn(
          `User with the same email or phone already exists.${email},${phone}`
        );
        return res.status(400).json({
          message: "User with the same email or phone already exists.",
        });
      }

      // Create a new user
      const {
        userId,
        email: createdEmail,
        name: createdName,
      } = await authModel.createUser(name, email, phone, password);

      // Generate JWT token
      const role = "user";
      const token = authModel.generateJWT(
        userId,
        createdEmail,
        createdName,
        role
      );

      logger.info(`User signed up successfully. User ID: ${userId}`);
      res.status(201).json({ userId, token });
    } catch (error) {
      logger.error(`Error signing up user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if the user exists
      const user = await authModel.loginUser(email, password);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid email or password or User not available" });
      }
      logger.info(user);

      // Generate JWT token
      const token = authModel.generateJWT(
        user.id,
        req.body.email,
        user.name,
        user.role
      );
      logger.info(`User logged in successfully. User ID: ${user.id}`);
      res.status(200).json({ userId: user.id, token });
    } catch (error) {
      logger.error(`Error logging in user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  verifyEmail: async (req, res) => {
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

  sendVerificationLink: async (req, res) => {
    const { email } = req.body;

    try {
      const userExists = await authModel.checkUserVerified(email);

      if (userExists) {
        return res.status(400).json({
          message: "User already Verified",
        });
      } else {
        // Generate verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1d", // Token expires in 1 day
        });

        // Send verification link via email
        const verificationLink = `${process.env.BASE_URL}/api/v1/auth/verify/${verificationToken}`;
        const mailer = await mailAuthenticator(
          email,
          "Email Verification",
          verificationLink
        );

        logger.info(`Verification email sent to: ${email}`);

        res
          .status(200)
          .json({ message: "Verification email sent successfully" });
      }
    } catch (error) {
      logger.error(`Error sending verification email: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  verifyToken: async (req, res) => {
    const { verificationToken } = req.params;

    try {
      // Verify the token
      const decodedToken = jwt.verify(
        verificationToken,
        process.env.JWT_SECRET
      );

      // Update database to mark email as verified
      await authModel.updateEmailVerification(decodedToken.email);

      logger.info(`Email verified for: ${decodedToken.email}`);

      res.redirect(`http://zenanvibe.com/`);
    } catch (error) {
      logger.error(`Error verifying email: ${error.message}`);
      res.redirect(`${process.env.CLIENT_URL}/email-verification-failed`);
    }
  },
};

module.exports = userController;
