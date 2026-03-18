const AlertModel = require('../models/alertModel');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Admin, Field Officer
const getAllAlerts = async (req, res) => {
  try {
    const { severity } = req.query;
    const alerts = severity
      ? await AlertModel.findBySeverity(severity)
      : await AlertModel.findAll();

    res.status(200).json({ count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single alert by ID
// @route   GET /api/alerts/:id
// @access  Admin, Field Officer
const getAlertById = async (req, res) => {
  try {
    const alert = await AlertModel.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found.' });
    res.status(200).json({ alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all alerts for a specific water source
// @route   GET /api/alerts/source/:sourceId
// @access  Admin, Field Officer
const getAlertsBySource = async (req, res) => {
  try {
    const alerts = await AlertModel.findBySourceId(req.params.sourceId);
    res.status(200).json({ count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually create an alert
// @route   POST /api/alerts
// @access  Admin
const createAlert = async (req, res) => {
  try {
    const { water_source_id, parameter, threshold_value, actual_value, severity } = req.body;

    if (!water_source_id || !parameter || !threshold_value || !actual_value || !severity) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const validSeverities = ['low', 'medium', 'high'];
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({ message: `Severity must be one of: ${validSeverities.join(', ')}` });
    }

    const alert = await AlertModel.create({
      water_source_id,
      parameter,
      threshold_value,
      actual_value,
      severity,
    });

    res.status(201).json({ message: 'Alert created.', alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an alert
// @route   DELETE /api/alerts/:id
// @access  Admin
const deleteAlert = async (req, res) => {
  try {
    const deleted = await AlertModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Alert not found.' });
    res.status(200).json({ message: 'Alert deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAlerts,
  getAlertById,
  getAlertsBySource,
  createAlert,
  deleteAlert,
};
