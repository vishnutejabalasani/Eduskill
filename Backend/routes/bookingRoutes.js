const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.post('/', bookingController.createBooking);

router.get('/my-bookings', bookingController.getMyBookings);
router.get('/job-requests', bookingController.getJobRequests);

router.patch('/:id/status', bookingController.updateBookingStatus);
router.post('/:id/review', bookingController.submitReview);

module.exports = router;
