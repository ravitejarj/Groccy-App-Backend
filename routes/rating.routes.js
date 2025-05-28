const express = require("express");
const router = express.Router();
const {
  createRating,
  getRatingsForVendor,
  getRatingByUser
} = require("../controllers/rating.controller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createRating);
router.get("/vendor/:vendorId", getRatingsForVendor);
router.get("/user/:userId/vendor/:vendorId", getRatingByUser);

module.exports = router;
