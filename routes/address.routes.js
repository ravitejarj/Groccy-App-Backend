// File: routes/address.routes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  getMyAddress,
  saveOrUpdateMyAddress,
} = require("../controllers/address.controller");

// ✅ Routes for single address per user
router.get("/my", verifyToken, getMyAddress);           // Fetch address for logged-in user
router.post("/save", verifyToken, saveOrUpdateMyAddress); // Create or update address

module.exports = router;
