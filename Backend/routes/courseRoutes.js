const express = require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 1) Specific Routes (Must come before generic /:id)

// Protected: Get My Courses
// We attach middleware directly here so we can define it before the public /:id route
router.get('/my-courses',
    authMiddleware.protect,
    authMiddleware.restrictTo('creator', 'admin'),
    courseController.getMyCourses
);

// 2) Public Routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);

// 3) Protected Routes (Apply to all below)
router.use(authMiddleware.protect);

router.post('/', authMiddleware.restrictTo('creator', 'admin'), courseController.createCourse);
router.patch('/:id', authMiddleware.restrictTo('creator', 'admin'), courseController.updateCourse);
router.delete('/:id', authMiddleware.restrictTo('creator', 'admin'), courseController.deleteCourse);
router.post('/:id/modules', authMiddleware.restrictTo('creator', 'admin'), courseController.addModule);
router.post('/:id/exam', authMiddleware.restrictTo('creator', 'admin'), courseController.addExam);
router.get('/:id/exam', authMiddleware.protect, courseController.getExam); // Protected to identify user
router.post('/:id/exam/submit', authMiddleware.protect, courseController.submitExam);

module.exports = router;
