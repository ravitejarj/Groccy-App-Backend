const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const verifyToken = require('../middleware/authMiddleware');

// ✅ Protect this route with JWT middleware
router.get('/user/:userId', verifyToken, orderController.getUserOrders);
router.post('/place', verifyToken, orderController.placeOrder);
router.get('/by-order-id/:orderId', verifyToken, orderController.getOrderById);

module.exports = router;
