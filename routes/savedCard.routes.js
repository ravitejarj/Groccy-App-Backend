const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  getSavedCards,
  addSavedCard,
  deleteSavedCard,
} = require("../controllers/savedCard.controller");

router.get("/", verifyToken, getSavedCards);
router.post("/", verifyToken, addSavedCard);
router.delete("/:id", verifyToken, deleteSavedCard);

module.exports = router;
