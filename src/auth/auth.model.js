"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../../config/db.config");

const Auth = {
  createUser: async (name, email, phone, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const status = "active"; // or set to your desired default status
    const role = "user";

    const query =
      "INSERT INTO user_consumer (name, email, phone, password, status, role) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [name, email, phone, hashedPassword, status, role];
    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, result) => {
        if (err) reject(err);
        console.log(result);
        resolve({ userId: result.insertId, email, name });
      });
    });
  },

  loginUser: async (email, password) => {
    const query =
      "SELECT id,name,password,status,phone,role FROM user_consumer WHERE email = ? AND deleted_at IS NULL";
    const values = [email];

    return new Promise((resolve, reject) => {
      pool.query(query, values, async (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length === 0 || result[0].deleted_at == 1) {
          resolve(null); // User not found
        } else {
          const match = await bcrypt.compare(password, result[0].password);
          if (match) {
            resolve(result[0]); // Successful login
          } else {
            resolve(null); // Incorrect password
          }
        }
      });
    });
  },

  checkUserExists: (email, phone) => {
    const query = "SELECT id FROM user_consumer WHERE email = ? OR phone = ?";
    const values = [email, phone];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result && result.length > 0);
        }
      });
    });
  },

  checkUserVerified: (email) => {
    const query = "SELECT id FROM user_consumer WHERE email_verification = 1 and email = ?";
    const values = [email];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result && result.length > 0);
        }
      });
    });
  },

  generateJWT: (userId, email, name, role) => {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId, email, name, role }, secretKey, {
      expiresIn: "7d",
    });
    return token;
  },

  updateEmailVerification: (email) => {
    const query = "UPDATE user_consumer SET email_verification = 1 WHERE email =?";
    const values = [email];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
};

module.exports = Auth;
