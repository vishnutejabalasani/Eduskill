const express = require('express');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect upload route
router.use(authMiddleware.protect);

router.post('/', uploadController.uploadPhoto, uploadController.uploadFile);

module.exports = router;
