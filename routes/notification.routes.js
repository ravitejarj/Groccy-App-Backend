const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  deleteNotification
} = require("../controllers/notification.controller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createNotification);
router.get("/:userId", verifyToken, getNotificationsByUser);
router.put("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;
