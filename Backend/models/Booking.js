const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must have a client']
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must have a professional']
    },
    eventType: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    duration: String,
    budget: String,
    requirements: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    review: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: Date
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
