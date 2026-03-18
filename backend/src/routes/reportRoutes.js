const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportById,
  getMyReports,
  getReportsBySource,
  updateReportStatus,
  deleteReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// GET /api/reports/my                  - Any logged in user
router.get('/my', protect, getMyReports);

// GET /api/reports/source/:sourceId    - Public
router.get('/source/:sourceId', getReportsBySource);

// GET /api/reports                     - Admin, Field Officer
router.get('/', protect, restrictTo('admin', 'field_officer'), getAllReports);

// GET /api/reports/:id                 - Admin, Field Officer
router.get('/:id', protect, restrictTo('admin', 'field_officer'), getReportById);

// POST /api/reports                    - Any logged in user
router.post('/', protect, createReport);

// PATCH /api/reports/:id/status        - Admin, Field Officer
router.patch('/:id/status', protect, restrictTo('admin', 'field_officer'), updateReportStatus);

// DELETE /api/reports/:id              - Admin only
router.delete('/:id', protect, restrictTo('admin'), deleteReport);

module.exports = router;
