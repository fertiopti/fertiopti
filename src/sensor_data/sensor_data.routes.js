const express = require('express');
const router = express.Router();
const sensorDataController = require('./sensor_data.controller');

// Route to get all sensor data
router.get('/getAllData', sensorDataController.getAllSensorData);
router.get('/getAllNutritionData', sensorDataController.getAllNutritionSensorData);
// Route to get sensor data by ID
router.get('/sensor-data/:id', sensorDataController.getSensorDataById);

module.exports = router;
