const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ['student', 'creator', 'client', 'admin'],
        default: 'student'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    // Hiring Profile
    title: String,
    hourlyRate: Number,
    portfolio: [{
        title: String,
        url: String,
        thumbnail: String, // New field for custom cover image
        description: String
    }],
    experience: String, // Years of experience or bio
    testimonials: [{
        clientName: String,
        role: String,
        comment: String,
        rating: { type: Number, min: 1, max: 5 }
    }],
    isOpenToWork: {
        type: Boolean,
        default: false
    },
    availability: {
        type: String,
        enum: ['full-time', 'part-time', 'both', 'freelance'],
        default: 'both'
    },
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
