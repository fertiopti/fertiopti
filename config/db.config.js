"use strict";

const mysql = require("mysql");
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MySQL database connection configuration
const dbConn = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 25060,
};

// Create MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConn.host,
  user: dbConn.user,
  password: dbConn.password,
  database: dbConn.database,
  port: dbConn.port,
});

// Connect to MySQL database
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("MySQL database connected successfully!");
  connection.release(); // Release connection back to pool
});

// Handle MySQL connection errors
pool.on("error", (err) => {
  console.error("MySQL connection error:", err);
});

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

// Export the MySQL pool and MongoDB client for use in other modules
module.exports = {
  mysqlPool: pool,
  mongoClient: client,
};
