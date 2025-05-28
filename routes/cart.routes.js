const express = require("express");
const router = express.Router();
const { getCart, saveCart, deleteCart } = require("../controllers/cart.controller");
const verifyToken = require("../middleware/authMiddleware");

router.get("/:userId", verifyToken, getCart);
router.post("/", verifyToken, saveCart);
router.delete("/:userId", verifyToken, deleteCart);

module.exports = router;
