const express = require('express');
const router = express.Router();
const { getUsers, likeProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all user profiles for dashboard
// @access  Private
router.get('/', protect, getUsers);

// @route   POST /api/users/like/:id
// @desc    Like a user's profile
// @access  Private
router.post('/like/:id', protect, likeProfile);

module.exports = router;