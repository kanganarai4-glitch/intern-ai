const express = require('express');
const router  = express.Router();
const {
    getApplications,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    getStats,
} = require('../controllers/applicationsController');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET  /api/applications/stats  – summary counts (must come before /:id)
router.get('/stats', getStats);

// GET  /api/applications
router.get('/', getApplications);

// POST /api/applications
router.post('/', createApplication);

// PUT  /api/applications/:id  – full update
router.put('/:id', updateApplication);

// PATCH /api/applications/:id/status  – quick status change (Kanban drag-drop)
router.patch('/:id/status', updateStatus);

// DELETE /api/applications/:id
router.delete('/:id', deleteApplication);

module.exports = router;
