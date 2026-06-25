const express = require('express');
const router  = express.Router();
const {
    getQuestions,
    generateAIQuestion,
    saveSession,
    getSessions,
    deleteSession,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET  /api/interview/questions?type=all&difficulty=medium&role=ML+Intern&company=Google
router.get('/questions', getQuestions);

// POST /api/interview/ai-question  – Gemini-generated custom question
router.post('/ai-question', generateAIQuestion);

// POST /api/interview/sessions  – save a completed practice session
router.post('/sessions', saveSession);

// GET  /api/interview/sessions  – get user's past sessions
router.get('/sessions', getSessions);

// DELETE /api/interview/sessions/:id
router.delete('/sessions/:id', deleteSession);

module.exports = router;
