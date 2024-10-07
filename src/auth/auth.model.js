"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { mongoClient } = require("../../config/db.config");
const { ObjectId } = require('mongodb');

const dbName = process.env.MONGODB_NAME;
const collectionName = 'user_data';

const Auth = {
  createUser: async (name, email, phone, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const status = "active"; // or set to your desired default status
    const role = "user";
    const emailAlert = "active";

    const user = {
      name,
      email,
      phone,
      password: hashedPassword,
      status,
      role,
      emailAlert,
      email_verification: false, // Assuming email verification is initially false
      deleted_at: null, // Assuming deleted_at field is used
    };

    try {
      const db = mongoClient.db(dbName); // Replace with your MongoDB database name
      const result = await db.collection(collectionName).insertOne(user);
      return { userId: result.insertedId, email, name };
    } catch (err) {
      throw new Error(`Error creating user: ${err.message}`);
    }
  },

  loginUser: async (email, password) => {
    try {
      const db = mongoClient.db(dbName);
      const user = await db.collection(collectionName).findOne({
        email,
        deleted_at: null, // Ensure that the user is not marked as deleted
      });

      if (!user) {
        return null; // User not found
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return user; // Successful login
      } else {
        return null; // Incorrect password
      }
    } catch (err) {
      throw new Error(`Error logging in user: ${err.message}`);
    }
  },

  checkUserExists: async (email, phone) => {
    try {
      const db = mongoClient.db(dbName);
      const user = await db.collection(collectionName).findOne({
        $or: [{ email }, { phone }],
      });
      return !!user; // Return true if user exists, false otherwise
    } catch (err) {
      throw new Error(`Error checking if user exists: ${err.message}`);
    }
  },

  checkUserVerified: async (email) => {
    try {
      const db = mongoClient.db(dbName);
      const user = await db.collection(collectionName).findOne({
        email,
        email_verification: true, // Check if email is verified
      });
      return !!user; // Return true if verified, false otherwise
    } catch (err) {
      throw new Error(`Error checking email verification: ${err.message}`);
    }
  },

  generateJWT: (userId, email, name, role) => {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId, email, name, role }, secretKey, {
      expiresIn: "7d",
    });
    return token;
  },

  updateEmailVerification: async (email) => {
    try {
      const db = mongoClient.db(dbName);
      await db.collection(collectionName).updateOne(
        { email },
        { $set: { email_verification: true } }
      );
    } catch (err) {
      throw new Error(`Error updating email verification: ${err.message}`);
    }
  },
};

module.exports = Auth;
