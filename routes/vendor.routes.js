const express = require("express");
const router = express.Router();
const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getNearbyVendors
} = require("../controllers/vendor.controller");
const verifyToken = require("../middleware/authMiddleware"); // FIXED import

router.post("/", verifyToken, createVendor);
router.get("/", getVendors);
router.get("/nearby", getNearbyVendors); // NEW endpoint
router.get("/:id", getVendorById);
router.put("/:id", verifyToken, updateVendor);
router.delete("/:id", verifyToken, deleteVendor);

module.exports = router;
