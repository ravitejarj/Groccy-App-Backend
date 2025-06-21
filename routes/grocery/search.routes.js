const express = require("express");
const router = express.Router();

const {
  searchCategories,
  searchSubcategories,
  searchProductsByVendor,
} = require("../../controllers/grocery/search.controller");

router.get("/categories", searchCategories);
router.get("/subcategories", searchSubcategories);
router.get("/products", searchProductsByVendor);

module.exports = router;
