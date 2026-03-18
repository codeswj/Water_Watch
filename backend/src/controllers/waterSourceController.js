const WaterSourceModel = require('../models/waterSourceModel');

// @desc    Create a new water source
// @route   POST /api/water-sources
// @access  Admin, Field Officer
const createWaterSource = async (req, res) => {
  try {
    const { name, type, latitude, longitude, status } = req.body;

    if (!name || !type || !latitude || !longitude) {
      return res.status(400).json({ message: 'Please provide name, type, latitude, and longitude.' });
    }

    const source = await WaterSourceModel.create({
      name, type, latitude, longitude, status, created_by: req.user.id,
    });

    res.status(201).json({ message: 'Water source created.', source });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all water sources
// @route   GET /api/water-sources
// @access  Public
const getAllWaterSources = async (req, res) => {
  try {
    const { status } = req.query;
    const sources = status
      ? await WaterSourceModel.findByStatus(status)
      : await WaterSourceModel.findAll();

    res.status(200).json({ count: sources.length, sources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single water source
// @route   GET /api/water-sources/:id
// @access  Public
const getWaterSourceById = async (req, res) => {
  try {
    const source = await WaterSourceModel.findById(req.params.id);
    if (!source) return res.status(404).json({ message: 'Water source not found.' });
    res.status(200).json({ source });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update water source
// @route   PUT /api/water-sources/:id
// @access  Admin, Field Officer
const updateWaterSource = async (req, res) => {
  try {
    const { name, type, latitude, longitude, status } = req.body;
    const updated = await WaterSourceModel.update(req.params.id, { name, type, latitude, longitude, status });
    if (!updated) return res.status(404).json({ message: 'Water source not found.' });
    res.status(200).json({ message: 'Water source updated.', source: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update water source status only
// @route   PATCH /api/water-sources/:id/status
// @access  Admin, Field Officer
const updateWaterSourceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required.' });
    const updated = await WaterSourceModel.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Water source not found.' });
    res.status(200).json({ message: 'Status updated.', source: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete water source
// @route   DELETE /api/water-sources/:id
// @access  Admin
const deleteWaterSource = async (req, res) => {
  try {
    const deleted = await WaterSourceModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Water source not found.' });
    res.status(200).json({ message: 'Water source deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWaterSource,
  getAllWaterSources,
  getWaterSourceById,
  updateWaterSource,
  updateWaterSourceStatus,
  deleteWaterSource,
};
