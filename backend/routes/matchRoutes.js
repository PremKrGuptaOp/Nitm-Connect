const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/matches
// @desc    Get all of the current user's matches
// @access  Private
router.get('/', protect, getMatches);

module.exports = router;