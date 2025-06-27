// routes/grocery/search.routes.js
const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/grocery/search.controller');

// GET /api/grocery/search/:vendorId/products?search=rice
router.get('/:vendorId/products', searchController.searchVendorProducts);

// ✅ Search within a specific category for a vendor
router.get('/:vendorId/category/:categoryId/products', searchController.searchVendorProductsInCategory);

module.exports = router;
