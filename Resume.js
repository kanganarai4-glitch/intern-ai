const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
    },
    mimeType: {
        type: String,
    },
    analysis: {
        atsScore:     { type: Number },
        grade:        { type: String },
        hint:         { type: String },
        quickStats: {
            words:    { type: Number },
            skills:   { type: Number },
            projects: { type: Number },
            keywords: { type: Number },
        },
        sectionScores: [{
            label: String,
            score: Number,
            color: String,
        }],
        strengths:        { type: [String], default: [] },
        weaknesses:       { type: [String], default: [] },
        suggestedSkills:  { type: [String], default: [] },
        improvementSteps: { type: [String], default: [] },
        rawText:          { type: String, select: false },
    },
    analyzedAt: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
