const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/talent', userController.getTalent);
router.get('/:id', userController.getTalentProfile);

// Protected routes
router.use(authMiddleware.protect);

router.get('/me', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { user: req.user }
    });
});
router.patch('/updateMe', userController.updateMe);

// Admin only
router.get('/', authMiddleware.restrictTo('admin'), userController.getAllUsers);

module.exports = router;
