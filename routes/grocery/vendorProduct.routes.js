const express = require("express");
const router = express.Router();
const {
  createVendorProduct,
  getVendorProducts,
  getVendorProductById,
  updateVendorProduct,
  deleteVendorProduct,
} = require("../../controllers/grocery/vendorProduct.controller");
const verifyToken = require("../../middleware/authMiddleware");

// ✅ Create vendor product
router.post("/", verifyToken, createVendorProduct);

// ✅ Get all vendor products (optionally filter by vendorId)
router.get("/", getVendorProducts);

// ✅ Get one vendor product by ID
router.get("/:id", getVendorProductById);

// ✅ Update vendor product
router.put("/:id", verifyToken, updateVendorProduct);

// ✅ Delete vendor product
router.delete("/:id", verifyToken, deleteVendorProduct);

module.exports = router;
