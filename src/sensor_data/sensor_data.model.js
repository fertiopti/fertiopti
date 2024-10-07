const { mongoClient } = require("../../config/db.config");
const { ObjectId } = require('mongodb');

const dbName = process.env.MONGODB_NAME;
const collectionName = 'sensor_data';

// Model to interact with MongoDB for sensor data
class SensorData {
  // Get all sensor data
  static async getAll() {
    try {
      const db = mongoClient.db(dbName);
      const collection = db.collection(collectionName);
      const data = await collection.find({}).toArray();
      return data;
    } catch (error) {
      console.log("Error fetching all sensor data:", error); // Changed to console.log
      throw error;
    }
  }

  static async getAllNutrition() {
    try {
      const db = mongoClient.db(dbName);
      const collection = db.collection("soil_data");
      const data = await collection.find({}).toArray();
      return data;
    } catch (error) {
      console.log("Error fetching all soil data:", error); // Changed to console.log
      throw error;
    }
  }

  // Get sensor data by ID
  static async getById(id) {
    try {
      const db = mongoClient.db(dbName);
      const collection = db.collection(collectionName);
      const data = await collection.findOne({ _id: new ObjectId(id) });
      return data;
    } catch (error) {
      console.log(`Error fetching sensor data by ID (${id}):`, error); // Changed to console.log
      throw error;
    }
  }
}

module.exports = SensorData;
