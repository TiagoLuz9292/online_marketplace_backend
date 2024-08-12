const { User } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Register function
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            userId: user.id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful', { token, userId: user.id });
        res.status(200).json({ token, userId: user.id });
    } catch (err) {
        console.log('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Request Password Reset function
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send('User not found');

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        // Send reset token via email (pseudo-code)
        // sendEmail(user.email, `Your password reset token is ${resetToken}`);

        res.status(200).json({ message: 'Password reset token generated', resetToken });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Reset Password function
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: { [Op.gt]: Date.now() }
            }
        });
        if (!user) return res.status(400).send('Invalid or expired token');

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        res.status(200).send('Password has been reset');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = { register, login, requestPasswordReset, resetPassword };
