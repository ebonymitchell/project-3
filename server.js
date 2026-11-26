require('dotenv').config();
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware for incoming request data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define the root route to verify API availability
app.get('/', (req, res) => {
    res.json({ message: 'TaskMaster API is running' });
});

// Mount the centralized application routes
app.use(routes);

// Start the server after establishing the database connection
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});