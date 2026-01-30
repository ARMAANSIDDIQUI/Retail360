const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_SERVICE_URL = 'http://localhost:5001';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/retail360', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

app.use('/api/auth', authRoutes);

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'retail360-node-backend' });
});

// Proxy to Python Service for ML Tasks
app.get('/api/ml/segmentation', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/api/segmentation`);
        res.json(response.data);
    } catch (error) {
        console.error("Error communicating with Python service:", error.message);
        res.status(500).json({ error: "Failed to fetch segmentation data" });
    }
});

app.get('/api/ml/forecast', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/api/forecast`);
        res.json(response.data);
    } catch (error) {
        console.error("Error communicating with Python service:", error.message);
        res.status(500).json({ error: "Failed to fetch forecast data" });
    }
});

app.get('/api/ml/stats', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/api/stats`);
        res.json(response.data);
    } catch (error) {
        console.error("Error communicating with Python service:", error.message);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

app.post('/api/ml/seed', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/api/seed`);
        res.json(response.data);
    } catch (error) {
        console.error("Error seeding data:", error.message);
        res.status(500).json({ error: "Failed to seed data" });
    }
});

// Data Ingestion Route (Upload)
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const FormData = require('form-data');

// Authenticated Upload Route
app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Enforce Upload Limit (Max 5)
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.uploads.length >= 5) {
            // Remove oldest (first in array)
            const oldestUpload = user.uploads.shift();
            // In a real app we might delete the actual file here too if stored locally/S3
            // but for now we just remove the record as requested.
            console.log(`Deleted old upload record: ${oldestUpload.filename}`);
        }

        // Add new upload record
        user.uploads.push({
            filename: req.file.originalname,
            path: req.file.path,
            date: new Date()
        });
        await user.save();

        // Forward to Python Service
        const filePath = req.file.path;
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath), req.file.originalname);

        const response = await axios.post(`${PYTHON_SERVICE_URL}/api/upload`, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // Cleanup local file after forwarding
        fs.unlinkSync(filePath);

        res.json({ ...response.data, uploads: user.uploads });
    } catch (error) {
        console.error("Error processing upload:", error.message);
        // Cleanup on error
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        res.status(500).json({
            error: "Failed to process data",
            details: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
