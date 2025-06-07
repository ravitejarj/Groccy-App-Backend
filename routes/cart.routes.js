const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// ➕ Add or update item in cart
router.post('/add', cartController.addToCart);

// 🧾 Get cart by user ID
router.get('/user/:userId', cartController.getCartByUser);

// 🖊️ Update quantity of an item
router.put('/update', cartController.updateCartItem);

// ❌ Remove item from cart
router.delete('/remove', cartController.removeCartItem);

// 🧹 Clear entire cart (optional)
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
