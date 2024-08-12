const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');

console.log(Product);

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
            const userId = req.user.userId; // Get the user ID from the request

            const newProduct = await Product.create({ name, description, price, currency, imageUrl, userId });
            res.status(201).json({ message: 'Product added successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
];

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll(); // Ensure Product is defined
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ where: { userId: req.user.userId } });
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.userId !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product removed' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
