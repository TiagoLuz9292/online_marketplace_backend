const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', expired: true });
        } else {
            return res.status(401).json({ message: 'Token is not valid' });
        }
    }
};

module.exports = auth;