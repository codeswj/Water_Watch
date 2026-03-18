const express = require('express');
const router = express.Router();
const {
  createWaterSource,
  getAllWaterSources,
  getWaterSourceById,
  updateWaterSource,
  updateWaterSourceStatus,
  deleteWaterSource,
} = require('../controllers/waterSourceController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// GET /api/water-sources         - Public
router.get('/', getAllWaterSources);

// GET /api/water-sources/:id     - Public
router.get('/:id', getWaterSourceById);

// POST /api/water-sources        - Admin, Field Officer
router.post('/', protect, restrictTo('admin', 'field_officer'), createWaterSource);

// PUT /api/water-sources/:id     - Admin, Field Officer
router.put('/:id', protect, restrictTo('admin', 'field_officer'), updateWaterSource);

// PATCH /api/water-sources/:id/status - Admin, Field Officer
router.patch('/:id/status', protect, restrictTo('admin', 'field_officer'), updateWaterSourceStatus);

// DELETE /api/water-sources/:id  - Admin only
router.delete('/:id', protect, restrictTo('admin'), deleteWaterSource);

module.exports = router;
