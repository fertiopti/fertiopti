const express = require("express");
const router = express.Router();
const communicationController = require("./communication.controller");
const authenticateJwt = require("../middleware/authenticateJWT");

/**
 * @swagger
 * info:
 *   version: 1.0.0
 *   title: Inseatfood Signup API
 *   description: API to sign up new users and retrieve JWT token for authentication.
 *
 * paths:
 *   /api/v1/communication/email:
 *     post:
 *       tags:
 *         - Communication
 *       summary: sends email.
 *       description: sends email to the user needed.
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *         - name: toMail
 *           in: formData
 *           type: string
 *           description: user Email.
 *         - name: subject
 *           in: formData
 *           type: string
 *           format: email
 *           description: subject of the Mail.
 *         - name: message
 *           in: formData
 *           type: string
 *           description: message that needs to be sent.
 *         - name: Authorization
 *           in: header
 *           type: string
 *           description: JWT token for user authentication.
 *           example: "your_jwt_token_here"
 *       responses:
 *         200:
 *           description: Mail sent Successfully.
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
 *                         message:
 *                           type: string
 *                           description: Mail sent Successfully.
 *                           example: "Mail sent Successfully"
 */




router.post("/email", authenticateJwt, communicationController.sendEmail);


module.exports = router;
