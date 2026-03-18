const express = require('express');
const router = express.Router();
const {
  getAllAlerts,
  getAlertById,
  getAlertsBySource,
  createAlert,
  deleteAlert,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// All alert routes require authentication
router.use(protect);

// GET /api/alerts                      - Admin, Field Officer
router.get('/', restrictTo('admin', 'field_officer'), getAllAlerts);

// GET /api/alerts/source/:sourceId     - Admin, Field Officer
router.get('/source/:sourceId', restrictTo('admin', 'field_officer'), getAlertsBySource);

// GET /api/alerts/:id                  - Admin, Field Officer
router.get('/:id', restrictTo('admin', 'field_officer'), getAlertById);

// POST /api/alerts                     - Admin only
router.post('/', restrictTo('admin'), createAlert);

// DELETE /api/alerts/:id               - Admin only
router.delete('/:id', restrictTo('admin'), deleteAlert);

module.exports = router;
