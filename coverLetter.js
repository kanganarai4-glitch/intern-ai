const express = require('express');
const router  = express.Router();
const { generate, save, getAll, remove } = require('../controllers/coverLetterController');
const { protect } = require('../middleware/auth');

router.use(protect);

// POST /api/cover-letter/generate  – generate a letter (not saved yet)
router.post('/generate', generate);

// POST /api/cover-letter  – save a letter
router.post('/', save);

// GET  /api/cover-letter  – list all saved letters
router.get('/', getAll);

// DELETE /api/cover-letter/:id
router.delete('/:id', remove);

module.exports = router;
