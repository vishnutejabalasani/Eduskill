const Booking = require('../models/Booking');
const User = require('../models/User');

// Create a new booking request
exports.createBooking = async (req, res) => {
    try {
        console.log("Create Booking Body:", req.body);
        const { professionalId, eventType, date, location, duration, budget, requirements } = req.body;

        const newBooking = await Booking.create({
            client: req.user._id,
            professional: professionalId,
            eventType,
            date,
            location,
            duration,
            budget,
            requirements
        });

        res.status(201).json({
            status: 'success',
            data: { booking: newBooking }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get bookings for the logged-in client (My Hires)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ client: req.user._id })
            .populate('professional', 'name title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get job requests for the logged-in professional
exports.getJobRequests = async (req, res) => {
    try {
        const bookings = await Booking.find({ professional: req.user._id })
            .populate('client', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Update booking status (Accept/Reject/Complete)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking not found' });

        // Simple permission check: Only the professional can accept/reject
        // Client can mark as completed? Or both? Let's say Professional marks completed for now, or Client does.
        // For simplicity: Professional accepts/rejects. Client or Professional can mark complete.

        booking.status = status;
        await booking.save();

        res.status(200).json({
            status: 'success',
            data: { booking }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Submit a review for a completed booking
exports.submitReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking not found' });

        // Verification: Must be the client
        if (booking.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ status: 'fail', message: 'Only the client can review this booking.' });
        }

        // Verification: Must be completed (or accepted/ongoing)
        if (booking.status === 'pending' || booking.status === 'rejected') {
            return res.status(400).json({ status: 'fail', message: 'Cannot review a pending or rejected booking.' });
        }

        // Save review to booking
        booking.review = {
            rating,
            comment,
            createdAt: Date.now()
        };
        await booking.save();

        // Push review to Professional's public profile (User model)
        // We need to re-add the 'testimonials' field to User schema first if we removed it!
        // Or we use a new field 'verifiedReviews'. Let's use 'testimonials' as it's semantic.
        const professional = await User.findById(booking.professional);
        if (professional) {
            // Ensure testimonials array exists
            if (!professional.testimonials) professional.testimonials = [];

            professional.testimonials.push({
                clientName: req.user.name, // Authenticated user's name
                role: 'Verified Client',
                comment: comment,
                rating: rating
            });
            await professional.save({ validateBeforeSave: false });
        }

        res.status(200).json({
            status: 'success',
            message: 'Review submitted successfully',
            data: { booking }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
