"use strict";

const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB connection configuration
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Run the MongoDB connection function
connectToMongoDB().catch(console.dir);

// Export the MongoDB client for use in other modules
module.exports = {
  mongoClient: client,
};
