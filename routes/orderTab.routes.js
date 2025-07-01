const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const orderTabController = require('../controllers/orderTab.controller');

// ✅ Route: Get past orders for a user
router.get('/user/:userId', verifyToken, orderTabController.getUserOrders);

module.exports = router;
