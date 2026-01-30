const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A course must have a title'],
        trim: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'A course must have a description']
    },
    thumbnail: {
        type: String,
        required: [true, 'A course must have a thumbnail image']
    },
    category: {
        type: String,
        required: [true, 'A course must have a category'],
        enum: ['Video Editing', 'Photography', 'Cooking', 'Event Management', 'Other']
    },
    level: {
        type: String,
        required: [true, 'A course must have a difficulty level'],
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    price: Number,
    durationMinutes: Number,
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    modules: [
        {
            title: { type: String, required: true },
            videoUrl: { type: String, required: true },
            duration: { type: Number, default: 0 } // in minutes
        }
    ],
    exam: [{
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true }
    }],
    isActive: { type: Boolean, default: true },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
