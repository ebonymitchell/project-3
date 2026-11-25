const jwt = require('jsonwebtoken');

// Define the token secret and expiration time
const secret = process.env.JWT_SECRET;
const expiration = '2h';

// Generate a signed JWT for an authenticated user
function signToken({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, {
        expiresIn: expiration,
        algorithm: 'HS256'
    });
}

// Verify the JWT before allowing access to protected routes
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Reject requests without a Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token and attach user data to the request
        const { data } = jwt.verify(token, secret, {
            algorithms: ['HS256']
        });

        req.user = data;

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

// Export authentication utilities
module.exports = {
    signToken,
    authMiddleware
};