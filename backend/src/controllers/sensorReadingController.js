const SensorReadingModel = require('../models/sensorReadingModel');
const WaterSourceModel = require('../models/waterSourceModel');
const alertEngine = require('../services/alertEngine');

// @desc    Ingest a new sensor reading
// @route   POST /api/sensor-readings
// @access  Field Officer, Admin
const createReading = async (req, res) => {
  try {
    const { water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level } = req.body;

    if (!water_source_id) {
      return res.status(400).json({ message: 'water_source_id is required.' });
    }

    // Verify water source exists
    const source = await WaterSourceModel.findById(water_source_id);
    if (!source) return res.status(404).json({ message: 'Water source not found.' });

    const reading = await SensorReadingModel.create({
      water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level,
    });

    // Run alert engine after ingesting reading
    await alertEngine.checkAndTrigger(reading, source);

    res.status(201).json({ message: 'Sensor reading recorded.', reading });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all readings for a water source
// @route   GET /api/sensor-readings/source/:sourceId
// @access  Public
const getReadingsBySource = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const readings = await SensorReadingModel.findBySourceId(req.params.sourceId, limit);
    res.status(200).json({ count: readings.length, readings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get latest reading for a water source
// @route   GET /api/sensor-readings/source/:sourceId/latest
// @access  Public
const getLatestReading = async (req, res) => {
  try {
    const reading = await SensorReadingModel.findLatestBySourceId(req.params.sourceId);
    if (!reading) return res.status(404).json({ message: 'No readings found for this source.' });
    res.status(200).json({ reading });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all readings (admin)
// @route   GET /api/sensor-readings
// @access  Admin
const getAllReadings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const readings = await SensorReadingModel.findAll(limit, offset);
    res.status(200).json({ count: readings.length, readings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a reading
// @route   DELETE /api/sensor-readings/:id
// @access  Admin
const deleteReading = async (req, res) => {
  try {
    const deleted = await SensorReadingModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Reading not found.' });
    res.status(200).json({ message: 'Reading deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReading, getReadingsBySource, getLatestReading, getAllReadings, deleteReading };
