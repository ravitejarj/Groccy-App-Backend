const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getVendorOrders,
  updateOrderStatus
} = require("../controllers/order.controller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createOrder);
router.get("/user/:userId", verifyToken, getUserOrders);
router.get("/vendor/:vendorId", verifyToken, getVendorOrders);
router.put("/:id", verifyToken, updateOrderStatus);

module.exports = router;
