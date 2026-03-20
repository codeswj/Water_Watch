const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// All feedback routes are admin-only
router.use(protect, restrictTo('admin'));

router.get('/', getAllFeedback);
router.post('/', createFeedback);

module.exports = router;
