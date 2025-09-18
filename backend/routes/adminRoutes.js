const express = require('express');
const router = express.Router();
const { getAllUsers, banUser, verifyUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All routes in this file are protected and require admin access
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/ban', protect, admin, banUser);
router.put('/users/:id/verify', protect, admin, verifyUser);

module.exports = router;