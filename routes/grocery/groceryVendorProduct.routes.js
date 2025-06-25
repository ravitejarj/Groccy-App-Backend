const express = require('express');
const router = express.Router();
const productController = require('../../controllers/grocery/groceryVendorProduct.controller');

// 🛒 Get all products for a vendor
router.get('/vendor/:vendorId/products', productController.getVendorProducts);

// 🛍️ Get a specific product by ID
router.get('/vendor/:vendorId/product/:productId', productController.getVendorProductById);

// 📦 Get subcategories for a vendor-category combination
router.get('/:vendorId/subcategories/:categoryId', productController.getVendorSubcategoriesByCategory);

// 🍱 Get products by vendor + subcategory
router.get('/:vendorId/subcategory/:subcategoryId/products', productController.getVendorProductsBySubcategory);

module.exports = router;
