const ReportModel = require('../models/reportModel');
const WaterSourceModel = require('../models/waterSourceModel');

// @desc    Submit a community report
// @route   POST /api/reports
// @access  Public (authenticated)
const createReport = async (req, res) => {
  try {
    const { water_source_id, description, photo_url, latitude, longitude } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    // If water_source_id provided, check it exists
    if (water_source_id) {
      const source = await WaterSourceModel.findById(water_source_id);
      if (!source) return res.status(404).json({ message: 'Water source not found.' });
    }

    const report = await ReportModel.create({
      water_source_id,
      submitted_by: req.user.id,
      description,
      photo_url,
      latitude,
      longitude,
    });

    res.status(201).json({ message: 'Report submitted successfully.', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Admin, Field Officer
const getAllReports = async (req, res) => {
  try {
    const { status } = req.query;
    const reports = status
      ? await ReportModel.findByStatus(status)
      : await ReportModel.findAll();

    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Admin, Field Officer
const getReportById = async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my reports (current user)
// @route   GET /api/reports/my
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await ReportModel.findByUserId(req.user.id);
    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports for a water source
// @route   GET /api/reports/source/:sourceId
// @access  Public
const getReportsBySource = async (req, res) => {
  try {
    const reports = await ReportModel.findBySourceId(req.params.sourceId);
    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Admin, Field Officer
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'verified', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await ReportModel.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Report not found.' });
    res.status(200).json({ message: 'Report status updated.', report: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Admin
const deleteReport = async (req, res) => {
  try {
    const deleted = await ReportModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Report not found.' });
    res.status(200).json({ message: 'Report deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  getMyReports,
  getReportsBySource,
  updateReportStatus,
  deleteReport,
};
