const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

const authRequired = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const token = tokenHeader.split(' ')[1]; // Remove 'Bearer '
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user; // Attach user payload to request
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied: Insufficient Privileges' });
        }
        next();
    };
};

module.exports = { authRequired, allowRoles };
