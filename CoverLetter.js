const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    tone: {
        type: String,
        enum: ['professional', 'enthusiastic', 'concise'],
        default: 'professional',
    },
    content: {
        type: String,
        required: true,
    },
    inputs: {
        manager:  { type: String, default: '' },
        skills:   { type: String, default: '' },
        project:  { type: String, default: '' },
        notes:    { type: String, default: '' },
    },
}, { timestamps: true });

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
