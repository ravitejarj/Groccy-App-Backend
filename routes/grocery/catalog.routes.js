// routes/grocery/catalog.routes.js

const express = require("express");
const router = express.Router();

const {
  getVendorStructure,
  getVendorCatalogProducts,
  getSingleProduct,
} = require("../../controllers/grocery/catalog.controller");

const {
  searchVendorCatalogProducts,
} = require("../../controllers/grocery/search.controller");

// ✅ Structure: categories & subcategories
router.get("/:vendorId/structure", getVendorStructure);

// ✅ Products by subcategory
router.get("/:vendorId/products", getVendorCatalogProducts);

// ✅ Single product full detail
router.get("/product/:id", getSingleProduct);

// ✅ 🔍 Product search by vendor
router.get("/:vendorId/search", searchVendorCatalogProducts);

module.exports = router;
