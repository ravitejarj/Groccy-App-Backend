const express = require("express");
const router = express.Router();
const {
  getVendorStructure,
  getVendorCatalogProducts
} = require("../controllers/catalog.controller");

router.get("/:vendorId/structure", getVendorStructure);
router.get("/:vendorId/products", getVendorCatalogProducts);

module.exports = router;
