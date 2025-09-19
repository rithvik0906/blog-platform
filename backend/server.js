// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL, // Frontend URL from environment variables
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}));

// Middleware to parse JSON
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Basic API route
app.get('/', (req, res) => {
  res.send('Blog Platform API is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
