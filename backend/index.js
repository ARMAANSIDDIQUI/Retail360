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

// MongoDB Connection (Placeholder - requires real URI in .env)
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log('MongoDB Connection Error:', err));

// Routes

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

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
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

        res.json(response.data);
    } catch (error) {
        console.error("Error communicating with Python service:", error.message);
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
