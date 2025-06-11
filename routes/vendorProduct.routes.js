const express = require("express");
const router = express.Router();
const {
  createVendorProduct,
  getVendorProducts,
  getVendorProductById,
  updateVendorProduct,
  deleteVendorProduct,
  searchVendorProducts,
} = require("../controllers/vendorProduct.controller");
const verifyToken = require("../middleware/authMiddleware");

// Add product
router.post("/", verifyToken, createVendorProduct);

// Get all or filter by vendor
router.get("/", getVendorProducts);

// Search products by vendorId + query
router.get("/search", searchVendorProducts);

// Get one by ID
router.get("/:id", getVendorProductById);

// Update
router.put("/:id", verifyToken, updateVendorProduct);

// Delete
router.delete("/:id", verifyToken, deleteVendorProduct);

module.exports = router;
