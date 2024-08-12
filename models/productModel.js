const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Ensure sequelize is imported correctly

const Product = sequelize.define('Product', {
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    price: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    },
    currency: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    imageUrl: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    userId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'id'
        }
    }
});

module.exports = Product;