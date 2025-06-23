const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const verifyToken = require('../middleware/authMiddleware'); // ✅ import

// ➕ Add or update item in cart
router.post('/add', verifyToken, cartController.addToCart);

// 🧾 Get cart by user ID
router.get('/user/:userId', verifyToken, cartController.getCartByUser);

// 🖊️ Update quantity of an item
router.put('/update', verifyToken, cartController.updateCartItem);

// ❌ Remove item from cart
router.delete('/remove', verifyToken, cartController.removeCartItem);

// 🧹 Clear entire cart (optional)
router.delete('/clear/:userId', verifyToken, cartController.clearCart);

module.exports = router;
