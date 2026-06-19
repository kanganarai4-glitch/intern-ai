const jwt  = require('jsonwebtoken');
const User = require('../models/User');


const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token: generateToken(user._id),
            user:  { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            message: 'Login successful',
            token: generateToken(user._id),
            user:  { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

const demoLogin = async (req, res) => {
    try {
        let demo = await User.findOne({ email: 'demo@internai.com' });

        if (!demo) {
            demo = await User.create({
                name:     'Kangana Rai',
                email:    'demo@internai.com',
                password: 'demo1234',
                isDemo:   true,
            });
        }

        res.json({
            success: true,
            message: 'Demo login successful',
            token: generateToken(demo._id),
            user:  { id: demo._id, name: demo.name, email: demo.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Demo login failed' });
    }
};

const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
};

module.exports = { register, login, demoLogin, getMe };
