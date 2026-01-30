const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// Restrict to admin only
router.use(authMiddleware.restrictTo('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getStats);

module.exports = router;
