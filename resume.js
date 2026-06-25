const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const { uploadAndAnalyse, getResumes, getResume, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// Configure multer for resume uploads
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads', 'resumes');
        require('fs').mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resume-${req.user._id}-${Date.now()}${ext}`);
    },
});

const resumeUpload = multer({
    storage: resumeStorage,
    limits:  { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        const allowedExts = /pdf|docx|doc/;
        const extOk  = allowedExts.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = allowedMimes.includes(file.mimetype);

        if (extOk || mimeOk) return cb(null, true);
        cb(new Error('Only PDF and DOCX files are allowed'));
    },
});

router.use(protect);

// POST /api/resume/upload  – upload & analyse in one step
router.post('/upload', resumeUpload.single('resume'), uploadAndAnalyse);

// GET  /api/resume  – list all resumes for the user
router.get('/', getResumes);

// GET  /api/resume/:id  – get single resume with analysis
router.get('/:id', getResume);

// DELETE /api/resume/:id
router.delete('/:id', deleteResume);

module.exports = router;
