const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    examScore: {
        type: Number,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    certificateId: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Certification', CertificationSchema);
