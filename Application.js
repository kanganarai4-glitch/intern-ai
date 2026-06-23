const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
    },
    location: {
        type: String,
        trim: true,
        default: '',
    },
    stipend: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['applied', 'interview', 'offer', 'rejected'],
        default: 'applied',
    },
    appliedDate: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        default: '',
    },
    internshipRef: {
        type: Number,
        default: null,
    },
}, { timestamps: true });

applicationSchema.index({ user: 1, company: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
