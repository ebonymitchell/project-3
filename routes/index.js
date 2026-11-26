const router = require('express').Router();
const apiRoutes = require('./api');

// Mount all API routes under the API prefix
router.use('/api', apiRoutes);

// Handle requests to undefined routes
router.use((req, res) => {
    return res.status(404).json({
        message: 'Route not found'
    });
});

// Export the main router
module.exports = router;