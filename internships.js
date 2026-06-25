const express = require('express');
const router  = express.Router();
const { getInternships, getInternship } = require('../controllers/internshipsController');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/internships?skills=Python,React&location=Bangalore&stipend=Above+40k&role=ML&sort=match
router.get('/', getInternships);

// GET /api/internships/:id
router.get('/:id', getInternship);

module.exports = router;
