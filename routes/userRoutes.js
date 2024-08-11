const express = require('express');
const { getProfile, deleteAccount, addPaymentMethod, getPaymentMethods, deletePaymentMethod } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware'); // Ensure this is imported correctly
const router = express.Router();

router.get('/profile', auth, getProfile);
router.delete('/profile', auth, deleteAccount);
router.post('/profile/payment-method', auth, addPaymentMethod);
router.get('/profile/payment-method', auth, getPaymentMethods);
router.delete('/profile/payment-method', auth, deletePaymentMethod);


module.exports = router;
