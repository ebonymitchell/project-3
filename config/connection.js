const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGO_URI);

// Log a successful database connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Handle database connection errors
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Export the database connection
module.exports = mongoose.connection;