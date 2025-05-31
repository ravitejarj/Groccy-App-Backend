const express = require("express");
const router = express.Router();
const {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");
const verifyToken = require("../middleware/authMiddleware");

// Create new address
router.post("/", createAddress);

// Get all addresses for a user
router.get("/:userId", verifyToken, getUserAddresses);

// Update address by ID
router.put("/:id", verifyToken, updateAddress);

// Delete address by ID
router.delete("/:id", verifyToken, deleteAddress);

module.exports = router;
