// routes/grocery/catalog.routes.js
const express = require('express');
const router = express.Router();
const catalogController = require('../../controllers/grocery/catalog.controller');

router.get('/catalog/:vendorId/structure', catalogController.getCatalogStructureByVendor);

module.exports = router;
