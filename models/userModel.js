const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    resetToken: {
        type: DataTypes.STRING
    },
    resetTokenExpiration: {
        type: DataTypes.DATE
    },
    accountBalance: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    accountBalanceCurrency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
    },
});

const PaymentMethod = sequelize.define('PaymentMethod', {
    methodType: {
        type: DataTypes.ENUM('credit_card', 'paypal'),
        allowNull: false
    },
    cardNumber: {
        type: DataTypes.STRING
    },
    expirationMonth: {
        type: DataTypes.INTEGER
    },
    expirationYear: {
        type: DataTypes.INTEGER
    },
    cardName: {
        type: DataTypes.STRING
    },
    cardSecret: {
        type: DataTypes.STRING
    },
    paypalEmail: {
        type: DataTypes.STRING
    },
});

User.hasMany(PaymentMethod, {
    as: 'paymentMethods',
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});
PaymentMethod.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = { User, PaymentMethod };
