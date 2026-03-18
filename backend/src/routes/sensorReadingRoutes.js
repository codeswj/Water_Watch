const express = require('express');
const router = express.Router();
const {
  createReading,
  getReadingsBySource,
  getLatestReading,
  getAllReadings,
  deleteReading,
} = require('../controllers/sensorReadingController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// GET /api/sensor-readings                          - Admin only
router.get('/', protect, restrictTo('admin'), getAllReadings);

// GET /api/sensor-readings/source/:sourceId         - Public
router.get('/source/:sourceId', getReadingsBySource);

// GET /api/sensor-readings/source/:sourceId/latest  - Public
router.get('/source/:sourceId/latest', getLatestReading);

// POST /api/sensor-readings                         - Admin, Field Officer
router.post('/', protect, restrictTo('admin', 'field_officer'), createReading);

// DELETE /api/sensor-readings/:id                   - Admin only
router.delete('/:id', protect, restrictTo('admin'), deleteReading);

module.exports = router;
