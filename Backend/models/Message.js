const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must have a sender']
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must have a recipient']
    },
    content: {
        type: String,
        required: [true, 'Message cannot be empty'],
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster lookups of conversations
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
