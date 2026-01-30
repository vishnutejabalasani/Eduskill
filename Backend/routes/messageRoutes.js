const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

router.post('/', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/:userId', messageController.getMessages);

module.exports = router;
