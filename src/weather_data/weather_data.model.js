const { mongoClient } = require("../../config/db.config");
const { ObjectId } = require('mongodb');

const dbName = process.env.MONGODB_NAME;
const WeathercollectionName = 'weather_data';

class WeatherData {
  // Get all sensor data
  static async getAll() {
    try {
      const db = mongoClient.db(dbName);
      const collection = db.collection(WeathercollectionName);
      const data = await collection.find({}).toArray();
      return data;
    } catch (error) {
      console.error("Error fetching all sensor data:", error); // Corrected
      throw error;
    }
  }

  // Get sensor data by ID
  static async getById(id) {
    try {
      const db = mongoClient.db(dbName);
      const collection = db.collection(WeathercollectionName);
      const data = await collection.findOne({ _id: new ObjectId(id) });
      return data;
    } catch (error) {
      console.error(`Error fetching sensor data by ID (${id}):`, error); // Corrected
      throw error;
    }
  }
}

module.exports = WeatherData;
