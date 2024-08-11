const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

exports.addProduct = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { name, description, price, currency } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
            const user = req.user.userId; // Get the user ID from the request

            const newProduct = new Product({ name, description, price, currency, imageUrl, user });
            await newProduct.save();
            res.status(201).json({ message: 'Product added successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
];

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('user', 'username'); // Ensure user is populated
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.userId }); // Note: req.user.userId
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        await product.remove();
        res.status(200).json({ message: 'Product removed' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
