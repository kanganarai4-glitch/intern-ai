const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    avatar: {
        type: String,
        default: '',
    },
    profile: {
        college:      { type: String, default: '' },
        degree:       { type: String, default: '' },
        branch:       { type: String, default: '' },
        year:         { type: String, default: '' },
        phone:        { type: String, default: '' },
        linkedin:     { type: String, default: '' },
        github:       { type: String, default: '' },
        bio:          { type: String, default: '' },
        prefRole:     { type: String, default: '' },
        prefLocation: { type: String, default: '' },
        duration:     { type: String, default: '' },
        availability: { type: String, default: '' },
        stipend:      { type: String, default: '' },
        skills:       { type: [String], default: [] },
        projects: [{
            title:  { type: String },
            tech:   { type: String },
            desc:   { type: String },
            github: { type: String },
            demo:   { type: String },
        }],
        certs: [{
            name:   { type: String },
            issuer: { type: String },
            year:   { type: String },
            link:   { type: String },
        }],
    },
    isDemo: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare plain password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
