const router = require('express').Router();
const userRoutes = require('./userRoutes');

// Mount user authentication routes
router.use('/users', userRoutes);

// Export the API router
module.exports = router;