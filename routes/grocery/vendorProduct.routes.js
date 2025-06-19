const express = require("express");
const router = express.Router();
const {
  createVendorProduct,
  getVendorProducts,
  getVendorProductById,
  updateVendorProduct,
  deleteVendorProduct,
  searchVendorProducts,
} = require("../../controllers/grocery/vendorProduct.controller");

const verifyToken = require("../../middleware/authMiddleware");

router.post("/", verifyToken, createVendorProduct);
router.get("/", getVendorProducts);
router.get("/search", searchVendorProducts);
router.get("/:id", getVendorProductById);
router.put("/:id", verifyToken, updateVendorProduct);
router.delete("/:id", verifyToken, deleteVendorProduct);

module.exports = router;
