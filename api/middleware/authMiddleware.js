import jwt from 'jsonwebtoken';
// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    // Check if token is provided
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }
    // Remove 'Bearer ' from the token (if present)
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(403).json({ message: 'Invalid token format. "Bearer <token>" is expected.' });
    }

    // Verify token
    jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET  , (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.'+err });
        }
    
        // Store the decoded token data (e.g., user info) in the request object
        req.user = decoded;
        next();
    });
};

export default verifyToken;