const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/talentmatch')
.then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const candidateRoutes = require('./routes/candidateRoutes');

// Core Routes
app.use('/api/candidates', candidateRoutes);

// Welcome message for the root URL
app.get('/', (req, res) => {
  res.send('TalentMatch API is beautifully running... 🚀');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy and running.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
