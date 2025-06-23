// routes/grocery/search.routes.js
const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/grocery/search.controller');

router.get('/search/:vendorId/products', searchController.searchVendorProducts);

module.exports = router;
