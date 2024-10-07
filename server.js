const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { MongoClient } = require('mongodb');
dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3030;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// define a root route
app.get("/", (req, res) => {
  res.status(412);
  res.send("No permission to view this");
});

app.get("/server_status", (req, res) => {
  res.status(200);
  res.send("SERVER UP");
});

app.get("/dbcheck", (req, res) => {
  if (mongoClient) {
    res.status(200);
    res.send("DB UP");
  }
});

// Importing Routes
const authRoutes = require("./src/auth/auth.routes");
const userRoutes = require("./src/user/user.routes");
const sensor_dataRoutes = require("./src/sensor_data/sensor_data.routes");
const weather_dataRoutes = require("./src/weather_data/weather_data.routes");
const communicationRoutes = require("./src/communication/communication.routes");

// using as middleware
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/sensor_data", sensor_dataRoutes);
app.use("/api/v1/weather_data", weather_dataRoutes);
app.use("/api/v1/communication", communicationRoutes);

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS,
  }
});

// Function to send alert email
const sendEmail = (email, message) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Soil Moisture Alert',
    text: message
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

// MongoDB client setup
const mongoClient = new MongoClient(process.env.MONGODB_URI);
mongoClient.connect().then(() => {
  console.log("Connected to MongoDB");
});

// CRON job to check soil moisture and send alerts
cron.schedule('*/30 * * * *', async () => {  // Every 30 minutes
  try {
    const db = mongoClient.db("smart_agriculture");
    const sensorCollection = db.collection("sensor_data");
    const userCollection = db.collection("user_data");

    // Get latest sensor data from MongoDB
    const sensorData = await sensorCollection.find().sort({ timestamp: -1 }).limit(1).toArray();
    if (!sensorData.length) return;

    const soilMoisture = sensorData[0].soil_moisture;
    
    // Query MongoDB for users with active email alerts
    const usersWithAlerts = await userCollection.find({ email_alert: 'active' }).toArray();
    if (!usersWithAlerts.length) return;

    const emailList = usersWithAlerts.map(user => user.email);
    
    let alertMessage = '';
    if (soilMoisture < 100) {
      alertMessage = `Water Clogging Alert: Soil moisture level is ${soilMoisture}. Immediate action needed.`;
    } else if (soilMoisture > 750) {
      alertMessage = `Soil Dryness Alert: Soil moisture level is ${soilMoisture}. Please water the soil.`;
    }
    
    if (alertMessage) {
      emailList.forEach(email => {
        sendEmail(email, alertMessage)
          .then(response => console.log(`Email sent to ${email}: ${response}`))
          .catch(error => console.error('Error sending email:', error));
      });
    }
  } catch (error) {
    console.error('Error in CRON job:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

// listen for requests
app.listen(port, () => {
  console.log(`API is listening on ${port}/`);
});
