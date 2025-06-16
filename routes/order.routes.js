const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/vendor/:vendorId', orderController.getVendorOrders);
router.put('/:id', orderController.updateOrderStatus);
router.get('/by-order-id/:orderId', orderController.getOrderByOrderId);

module.exports = router;
