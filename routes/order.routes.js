const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const ordersTabController = require('../controllers/ordersTab.controller'); // ✅ added

// Existing Routes
router.post('/', orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/vendor/:vendorId', orderController.getVendorOrders);
router.put('/:id', orderController.updateOrderStatus);
router.get('/by-order-id/:orderId', orderController.getOrderByOrderId);

// ✅ New: Orders Tab Route
router.get('/tab/:userId', ordersTabController.getOrdersTabData);

module.exports = router;
