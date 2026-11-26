const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');

// Mount user authentication routes
router.use('/users', userRoutes);

// Mount project management routes
router.use('/projects', projectRoutes);

// Export the API router
module.exports = router;