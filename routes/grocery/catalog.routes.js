const express = require("express");
const router = express.Router();

const {
  getVendorStructure,
  getVendorCatalogProducts,
  getSingleProduct,
} = require("../../controllers/grocery/catalog.controller");

router.get("/:vendorId/structure", getVendorStructure);
router.get("/:vendorId/products", getVendorCatalogProducts);
router.get("/product/:id", getSingleProduct);

module.exports = router;
