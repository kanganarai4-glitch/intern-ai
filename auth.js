const express = require('express');
const router  = express.Router();
const { register, login, demoLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/demo
router.post('/demo', demoLogin);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

module.exports = router;
