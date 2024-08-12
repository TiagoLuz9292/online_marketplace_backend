const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false, // Disable SQL query logging, set to true to enable
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected');
    } catch (err) {
        console.error('Unable to connect to PostgreSQL:', err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
