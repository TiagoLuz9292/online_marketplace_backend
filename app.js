const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const { sequelize } = require('./config/db');
// const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Generate a new secret on every restart
const sessionSecret = crypto.randomBytes(64).toString('hex');

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Enable CORS
app.use(cors({ origin: '*', credentials: true }));

// Connect to database

sequelize.authenticate()
    .then(() => {
        console.log('PostgreSQL connected');
        return sequelize.sync(); // Synchronize models with the database
    })
    .then(() => {
        console.log('Database & tables created!');
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err.message);
    });

//connectDB();

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);  // Ensure this line is present

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

