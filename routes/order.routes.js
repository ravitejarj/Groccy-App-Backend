const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const ordersTabController = require("../controllers/ordersTab.controller");

// Main order routes
router.post("/", orderController.createOrder);
router.get("/user/:userId", orderController.getOrdersByUser);
router.get("/vendor/:vendorId", orderController.getOrdersByVendor);
router.put("/:orderId", orderController.updateOrderStatus);
router.get("/by-order-id/:orderId", orderController.getOrderByOrderId);

// ✅ Orders Tab Route — use direct object, not destructure
router.get("/tab/:userId", ordersTabController.getOrdersTabData);

module.exports = router;
