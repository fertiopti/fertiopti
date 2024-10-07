const express = require('express');
const router = express.Router();
const WeatherDataController = require('./weather_data.controller');

// Route to get all sensor data
router.get('/getAllWeatherData', WeatherDataController.getAllWeatherData);

// Route to get sensor data by ID
router.get('/weather-data/:id', WeatherDataController.getWeatherDataById);

module.exports = router;
