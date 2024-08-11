const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getUserProducts, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

router.post('/add', auth, addProduct);
router.get('/', getProducts);
router.get('/user', auth, getUserProducts);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
