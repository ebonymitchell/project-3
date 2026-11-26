const router = require('express').Router();
const { User } = require('../../models');
const { signToken } = require('../../utils/auth');

// Register a new user and return a signed JWT
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body || {};

        // Verify that all required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Username, email, and password are required'
            });
        }

        // Create the user with password hashing handled by the model
        const user = await User.create({
            username,
            email,
            password
        });

        const token = signToken(user);

        // Return user information without exposing the password
        return res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        // Handle duplicate usernames or email addresses
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'Username or email already exists'
            });
        }

        // Handle schema validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            });
        }

        return res.status(500).json({
            message: 'Unable to register user'
        });
    }
});

// Authenticate an existing user and return a signed JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};

        // Verify that valid login credentials are provided
        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find the user and explicitly include the password hash
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        // Reject invalid login credentials
        if (!user || !(await user.isCorrectPassword(password))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = signToken(user);

        // Return the token and sanitized user information
        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Unable to log in'
        });
    }
});

// Export the user routes
module.exports = router;