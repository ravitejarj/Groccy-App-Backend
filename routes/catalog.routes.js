const express = require("express");
const router = express.Router();

const {
  getVendorStructure,
  getVendorCatalogProducts,
  getSingleProduct // ✅ Step 1: Import the controller
} = require("../controllers/catalog.controller");

// ✅ Step 2: Existing routes
router.get("/:vendorId/structure", getVendorStructure);
router.get("/:vendorId/products", getVendorCatalogProducts);

// ✅ Step 3: New route to fetch single product by ID
router.get("/product/:id", getSingleProduct);

module.exports = router;
