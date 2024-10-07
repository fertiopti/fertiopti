const SensorData = require('./sensor_data.model');

// Controller to get all sensor data
exports.getAllSensorData = async (req, res) => {
  try {
    const data = await SensorData.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving sensor data:", error); // Corrected this line
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllNutritionSensorData = async (req, res) => {
  try {
    const data = await SensorData.getAllNutrition();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving nutrition sensor data:", error); // Corrected this line
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get sensor data by a specific ID
exports.getSensorDataById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await SensorData.getById(id);
    if (!data) {
      return res.status(404).json({ message: "Sensor data not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error retrieving sensor data by ID (${id}):`, error); // Corrected this line
    res.status(500).json({ message: "Internal server error" });
  }
};
