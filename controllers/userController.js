const User = require('../models/userModel');
const Product = require('../models/productModel'); // Ensure this is imported

const getProfile = async (req, res) => {
    try {
        console.log('Fetching user profile for user:', req.user.userId); // Debugging statement
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User profile found:', user); // Debugging statement
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(400).json({ error: err.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        console.log('Deleting account for user:', req.user.userId); // Debugging statement
        const user = await User.findById(req.user.userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user's products
        await Product.deleteMany({ user: req.user.userId });
        console.log('Deleted products for user:', req.user.userId); // Debugging statement

        // Delete the user
        await User.deleteOne({ _id: req.user.userId });
        console.log('Deleted user:', req.user.userId); // Debugging statement

        res.json({ message: 'User and associated products deleted' });
    } catch (err) {
        console.error('Error deleting user account:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addPaymentMethod = async (req, res) => {
    try {
        console.log('Adding payment method for user:', req.user.userId); // Debugging statement

        const { methodType, cardNumber, expirationMonth, expirationYear, cardName, cardSecret, paypalEmail } = req.body;

        // Validate the payment method
        if (methodType === 'credit_card' && (!cardNumber || !expirationMonth || !expirationYear || !cardName || !cardSecret)) {
            return res.status(400).json({ message: 'All credit card fields are required' });
        }

        if (methodType === 'paypal' && !paypalEmail) {
            return res.status(400).json({ message: 'PayPal email is required' });
        }

        // Find the user
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         // Check for existing payment method
        if (methodType === 'credit_card') {
            const existingCard = user.paymentMethods.find(method => method.cardNumber === cardNumber);
            if (existingCard) {
                return res.status(400).json({ message: 'Credit card with this number already exists' });
            }
        }

        if (methodType === 'paypal') {
            const existingPaypal = user.paymentMethods.find(method => method.paypalEmail === paypalEmail);
            if (existingPaypal) {
                return res.status(400).json({ message: 'PayPal account with this email already exists' });
            }
        }

        // Create the payment method object
        const paymentMethod = {
            methodType,
            cardNumber,
            expirationMonth,
            expirationYear,
            cardName,
            cardSecret,
            paypalEmail
        };

        // Add the payment method to the user's paymentMethods array
        user.paymentMethods.push(paymentMethod);
        await user.save();

        console.log('Payment method added for user:', req.user.userId); // Debugging statement

        res.status(200).json({ message: 'Payment method added successfully', paymentMethods: user.paymentMethods });
    } catch (err) {
        console.error('Error adding payment method:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getPaymentMethods = async (req, res) => {
    try {
        console.log('Fetching payment methods for user:', req.user.userId); // Debugging statement
        const user = await User.findById(req.user.userId).select('paymentMethods');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Payment methods found:', user.paymentMethods); // Debugging statement
        res.status(200).json(user.paymentMethods);
    } catch (err) {
        console.error('Error fetching payment methods:', err);
        res.status(400).json({ error: err.message });
    }
};

const deletePaymentMethod = async (req, res) => {
    try {
        const { methodType, cardNumber, paypalEmail } = req.body;

        console.log('Deleting payment method for user:', req.user.userId); // Debugging statement

        // Find the user
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Determine which payment method to delete
        let initialLength = user.paymentMethods.length;

        if (methodType === 'credit_card') {
            user.paymentMethods = user.paymentMethods.filter(method => method.cardNumber !== cardNumber);
        } else if (methodType === 'paypal') {
            user.paymentMethods = user.paymentMethods.filter(method => method.paypalEmail !== paypalEmail);
        } else {
            return res.status(400).json({ message: 'Invalid payment method type' });
        }

        if (user.paymentMethods.length === initialLength) {
            return res.status(404).json({ message: `${methodType.charAt(0).toUpperCase() + methodType.slice(1)} account not found` });
        }

        await user.save();

        console.log('Payment method deleted for user:', req.user.userId); // Debugging statement

        res.status(200).json({ message: 'Payment method deleted successfully', paymentMethods: user.paymentMethods });
    } catch (err) {
        console.error('Error deleting payment method:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getProfile, deleteAccount, addPaymentMethod, getPaymentMethods, deletePaymentMethod };
