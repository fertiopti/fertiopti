const WeatherData = require('./weather_data.model');

// Controller to get all sensor data
exports.getAllWeatherData = async (req, res) => {
  try {
    const data = await WeatherData.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving sensor data:", error); // Corrected
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get sensor data by a specific ID
exports.getWeatherDataById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await WeatherData.getById(id);
    if (!data) {
      return res.status(404).json({ message: "Sensor data not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error retrieving sensor data by ID (${id}):`, error); // Corrected
    res.status(500).json({ message: "Internal server error" });
  }
};
