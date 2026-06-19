const Application = require('../models/Application');

const getApplications = async (req, res) => {
    try {
        const apps = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, count: apps.length, applications: apps });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch applications' });
    }
};


const createApplication = async (req, res) => {
    const { company, role, location, stipend, status, appliedDate, notes, internshipRef } = req.body;

    if (!company || !role) {
        return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    try {
        
        const exists = await Application.findOne({ user: req.user._id, company, role });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: 'You have already added this application',
                application: exists,
            });
        }

        const app = await Application.create({
            user: req.user._id,
            company,
            role,
            location:     location     || '',
            stipend:      stipend      || '',
            status:       status       || 'applied',
            appliedDate:  appliedDate  ? new Date(appliedDate) : new Date(),
            notes:        notes        || '',
            internshipRef: internshipRef || null,
        });

        res.status(201).json({ success: true, message: 'Application added', application: app });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create application' });
    }
};

const updateApplication = async (req, res) => {
    try {
        const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
        if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

        const { company, role, location, stipend, status, appliedDate, notes } = req.body;

        if (company)     app.company     = company;
        if (role)        app.role        = role;
        if (location !== undefined) app.location = location;
        if (stipend  !== undefined) app.stipend  = stipend;
        if (status)      app.status      = status;
        if (appliedDate) app.appliedDate = new Date(appliedDate);
        if (notes   !== undefined) app.notes    = notes;

        await app.save();
        res.json({ success: true, message: 'Application updated', application: app });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update application' });
    }
};

const updateStatus = async (req, res) => {
    const { status } = req.body;
    const allowed = ['applied', 'interview', 'offer', 'rejected'];

    if (!status || !allowed.includes(status)) {
        return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    try {
        const app = await Application.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status },
            { new: true }
        );
        if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

        res.json({ success: true, message: `Status updated to ${status}`, application: app });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

const deleteApplication = async (req, res) => {
    try {
        const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
        if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

        await app.deleteOne();
        res.json({ success: true, message: 'Application deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete application' });
    }
};

const getStats = async (req, res) => {
    try {
        const apps = await Application.find({ user: req.user._id });

        const stats = {
            total:     apps.length,
            applied:   apps.filter(a => a.status === 'applied').length,
            interview: apps.filter(a => a.status === 'interview').length,
            offer:     apps.filter(a => a.status === 'offer').length,
            rejected:  apps.filter(a => a.status === 'rejected').length,
        };

        res.json({ success: true, stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};

module.exports = { getApplications, createApplication, updateApplication, updateStatus, deleteApplication, getStats };
