const express  = require('express');
const dotenv   = require('dotenv');
const cors     = require('cors');
const morgan   = require('morgan');
const path     = require('path');
const connectDB = require('./config/db');


dotenv.config();


connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));
app.use(morgan('dev'));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth',         require('./routes/auth'));
app.use('/api/profile',      require('./routes/profile'));
app.use('/api/resume',       require('./routes/resume'));
app.use('/api/internships',  require('./routes/internships'));
app.use('/api/cover-letter', require('./routes/coverLetter'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/interview',    require('./routes/interview'));


app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'InternAI API is running',
        version: '1.0.0'
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`InternAI server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});