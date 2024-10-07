const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const authenticateJwt = require("../middleware/authenticateJWT");

/**
 * @swagger
 * info:
 *   version: 1.0.0
 *   title: Inseatfood Signup API
 *   description: API to sign up new users and retrieve JWT token for authentication.
 *
 * paths:
 *   /api/v1/auth/signup:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Signup new users with provided parameters.
 *       description: Used to signup new users and obtain a JWT token.
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *         - name: name
 *           in: formData
 *           type: string
 *           description: The user's name.
 *         - name: email
 *           in: formData
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         - name: phone
 *           in: formData
 *           type: string
 *           description: The user's phone number.
 *         - name: password
 *           in: formData
 *           type: string
 *           description: The user's password.
 *       responses:
 *         200:
 *           description: New user added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           description: The user ID.
 *                           example: 17
 *                         token:
 *                           type: string
 *                           description: JWT token for authentication.
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjh9LCJlbWFpbCI6InNvdW5kY2FydEBnbWFpbC5jb20iLCJpYXQiOjE4MDM2MTYxMDcsImV4cCI6MTgzNzYyNjEwN30.0xBW1w5oP4F9C3an6YUb2gevW3I18gJj8e3ZkRp5A40"
 *   /api/v1/auth/login:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Authenticate users with provided credentials.
 *       description: Used to log in users and obtain a JWT token.
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *         - name: email
 *           in: formData
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         - name: password
 *           in: formData
 *           type: string
 *           description: The user's password.
 *       responses:
 *         200:
 *           description: New user added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: JWT token for authentication.
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjh9LCJlbWFpbCI6InNvdW5kY2FydEBnbWFpbC5jb20iLCJpYXQiOjE4MDM2MTYxMDcsImV4cCI6MTgzNzYyNjEwN30.0xBW1w5oP4F9C3an6YUb2gevW3I18gJj8e3ZkRp5A40"
 *
 *  
 *   /api/v1/auth/send-verification-link:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Authenticate users with provided credentials.
 *       description: Used to log in users and obtain a JWT token.
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *         - name: email
 *           in: formData
 *           type: string
 *           format: email
 *           description: The user's email address.
 *       responses:
 *         200:
 *           description: user verified successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: sends verification email to the user.
 *                           example: "Verification email sent successfully"
 */

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/send-verification-link", authController.sendVerificationLink);
router.get("/verify/:verificationToken", authController.verifyToken);

module.exports = router;
