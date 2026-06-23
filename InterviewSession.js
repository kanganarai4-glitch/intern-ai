const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetRole: {
        type: String,
        default: '',
    },
    targetCompany: {
        type: String,
        default: '',
    },
    questionType: {
        type: String,
        enum: ['all', 'hr', 'technical', 'behavioral'],
        default: 'all',
    },
    difficulty: {
        type: String,
        enum: ['all', 'easy', 'medium', 'hard'],
        default: 'all',
    },
    totalQuestions: {
        type: Number,
        default: 0,
    },
    completedQuestions: {
        type: Number,
        default: 0,
    },
    answers: [{
        questionId:   { type: Number },
        questionText: { type: String },
        notes:        { type: String },
        timeTaken:    { type: Number }, 
        markedDone:   { type: Boolean, default: false },
    }],
    completedAt: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
