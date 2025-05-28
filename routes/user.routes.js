const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/user.controller");
const verifyToken = require("../middleware/authMiddleware");

router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);

module.exports = router;
