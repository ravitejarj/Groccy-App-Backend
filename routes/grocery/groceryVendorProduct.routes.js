// routes/grocery/groceryVendorProduct.routes.js
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/grocery/groceryVendorProduct.controller');

router.get('/vendor/:vendorId/products', productController.getVendorProducts);
router.get('/vendor/:vendorId/product/:productId', productController.getVendorProductById);

module.exports = router;
