"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../../config/db.config");

const User = {
  createUser: async (name, email, phone, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const status = "active"; // or set to your desired default status
    const deleted_at = 0;

    const query =
      "INSERT INTO user_consumer (name, email, phone, password, status, created_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      name,
      email,
      phone,
      hashedPassword,
      status,
      created_at,
      deleted_at,
    ];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) reject(err);
        console.log(email);
        resolve({ userId: result.insertId, email, name });
      });
    });
  },

  loginUser: async (email, password) => {
    const query =
      "SELECT id,name,password,status,phone,role FROM user_consumer WHERE email = ? AND deleted_at = 0";
    const values = [email];

    return new Promise((resolve, reject) => {
      db.query(query, values, async (err, result) => {
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
  adminLoginUser: async (email, password) => {
    const query =
      "SELECT U.id, U.name, U.password, U.status, U.phone, U.role, S.store_id FROM Users U JOIN Stores S ON U.id = S.merchant_id WHERE U.email = ?";
    const values = [email];

    return new Promise((resolve, reject) => {
      db.query(query, values, async (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length === 0) {
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
      db.query(query, values, (err, result) => {
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

  getAllUsers: () => {
    const query = "SELECT id, name, email, status, phone FROM user_consumer";
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getUserInfo: (userId) => {
    const query =
      "SELECT name, email, status, phone FROM user_consumer WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, userId, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  updateUser: (userId, updatedData) => {
    const query = "UPDATE user_consumer SET ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [updatedData, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  deleteUser: (userId) => {
    const currentDateTime = new Date();
    const query =
      "UPDATE user_consumer SET status='deactive', deleted_At=? WHERE id = ?";

    return new Promise((resolve, reject) => {
      db.query(query, [currentDateTime, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  emailAlertActive: (email) => {
    const query = "UPDATE user_consumer SET email_alert = 'active' WHERE email = ?";
    const values = [email];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  emailAlertDeactive: (email) => {
    const query = "UPDATE user_consumer SET email_alert = 'inactive' WHERE email = ?";
    const values = [email];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};

module.exports = User;
