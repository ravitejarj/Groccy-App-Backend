// File: routes/address.routes.js
const express = require("express");
const router = express.Router();
const {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Secure all routes
router.post("/", verifyToken, createAddress);
router.get("/:userId", verifyToken, getUserAddresses);
router.put("/:id", verifyToken, updateAddress);
router.delete("/:id", verifyToken, deleteAddress);

module.exports = router;
