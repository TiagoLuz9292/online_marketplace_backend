const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    methodType: { type: String, enum: ['credit_card', 'paypal'], required: true },
    cardNumber: { type: String }, // For credit card only
    expirationMonth: { type: Number }, // For credit card only
    expirationYear: { type: Number }, // For credit card only
    cardName: { type: String }, // For credit card only
    cardSecret: { type: String }, // For credit card only
    paypalEmail: { type: String } // For PayPal only
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    resetToken: { type: String }, // For password reset functionality
    resetTokenExpiration: { type: Date },
    accountBalance: { type: Number, default: 0 }, // Account Balance
    accountBalanceCurrency: { type: String, default: 'USD' },
    paymentMethods: [paymentMethodSchema] // Array of payment methods
});

const User = mongoose.model('User', userSchema);

module.exports = User;
