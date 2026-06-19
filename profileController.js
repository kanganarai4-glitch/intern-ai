const User = require('../models/User');
const path = require('path');
const fs   = require('fs');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({
            success: true,
            profile: {
                fullName: user.name,
                email:    user.email,
                avatar:   user.avatar,
                ...user.profile.toObject(),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            fullName, college, degree, branch, year, phone,
            linkedin, github, bio, prefRole, prefLocation,
            duration, availability, stipend, skills, projects, certs,
        } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (fullName) user.name = fullName;

        user.profile = {
            ...user.profile.toObject(),
            college:      college      ?? user.profile.college,
            degree:       degree       ?? user.profile.degree,
            branch:       branch       ?? user.profile.branch,
            year:         year         ?? user.profile.year,
            phone:        phone        ?? user.profile.phone,
            linkedin:     linkedin     ?? user.profile.linkedin,
            github:       github       ?? user.profile.github,
            bio:          bio          ?? user.profile.bio,
            prefRole:     prefRole     ?? user.profile.prefRole,
            prefLocation: prefLocation ?? user.profile.prefLocation,
            duration:     duration     ?? user.profile.duration,
            availability: availability ?? user.profile.availability,
            stipend:      stipend      ?? user.profile.stipend,
            skills:       skills       !== undefined ? skills    : user.profile.skills,
            projects:     projects     !== undefined ? projects  : user.profile.projects,
            certs:        certs        !== undefined ? certs     : user.profile.certs,
        };

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            profile: {
                fullName: user.name,
                email:    user.email,
                avatar:   user.avatar,
                ...user.profile.toObject(),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.avatar) {
            const oldPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        user.avatar = `/uploads/avatars/${req.file.filename}`;
        await user.save();

        res.json({
            success: true,
            message: 'Avatar uploaded',
            avatarUrl: user.avatar,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Avatar upload failed' });
    }
};

module.exports = { getProfile, updateProfile, uploadAvatar };
