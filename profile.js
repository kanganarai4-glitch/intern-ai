const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads', 'avatars');
        require('fs').mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const avatarUpload = multer({
    storage: avatarStorage,
    limits:  { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image files are allowed for avatar'));
    },
});

// All routes are protected
router.use(protect);

// GET  /api/profile
router.get('/', getProfile);

// PUT  /api/profile
router.put('/', updateProfile);

// POST /api/profile/avatar
router.post('/avatar', avatarUpload.single('avatar'), uploadAvatar);

module.exports = router;
