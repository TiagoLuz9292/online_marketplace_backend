const User = require('../models/userModel');

const roleMiddleware = (role) => async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== role) return res.status(403).send('Forbidden');
        next();
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = roleMiddleware;
