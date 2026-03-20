const FeedbackModel = require('../models/feedbackModel');
const ReportModel = require('../models/reportModel');
const NotificationModel = require('../models/notificationModel');

// @desc    Create feedback for a report
// @route   POST /api/feedback
// @access  Admin
const createFeedback = async (req, res) => {
  try {
    const { report_id, message, visibility = 'public' } = req.body;

    if (!report_id || !message?.trim()) {
      return res.status(400).json({ message: 'Report and message are required.' });
    }

    const report = await ReportModel.findById(report_id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const feedback = await FeedbackModel.create({
      report_id,
      admin_id: req.user.id,
      message: message.trim(),
      visibility,
    });

    if (report.submitted_by) {
      const targetUserId = report.submitted_by;
      const targetLabel = report.source_name ? `about ${report.source_name}` : `for report #${report.id}`;
      const notificationMessage = `Admin feedback ${targetLabel}: ${message.trim()}`;

      await NotificationModel.create({
        user_id: targetUserId,
        message: notificationMessage,
        type: 'feedback',
      });
    }

    res.status(201).json({ message: 'Feedback shared successfully.', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List feedback entries
// @route   GET /api/feedback
// @access  Admin
const getAllFeedback = async (req, res) => {
  try {
    const { reportId, visibility } = req.query;
    const feedbacks = await FeedbackModel.findAll({
      report_id: reportId,
      visibility,
    });
    res.status(200).json({ count: feedbacks.length, feedbacks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
};
