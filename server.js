require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// Middleware
app.use(cors({
    origin: process.env.REACT_APP_ALLOWED_ORIGINS
}));
app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Main proxy route for chat
app.post('/proxy', async (req, res) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: req.body.question,
                context: "Naval Ravikant's teachings and philosophy"
            })
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 