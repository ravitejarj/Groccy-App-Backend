// routes/grocery/search.routes.js
const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/grocery/search.controller');

// GET /api/grocery/search/:vendorId/products?search=rice
router.get('/:vendorId/products', searchController.searchVendorProducts);

module.exports = router;
