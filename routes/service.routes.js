const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} = require("../controllers/service.controller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/:id", verifyToken, updateService);
router.delete("/:id", verifyToken, deleteService);

module.exports = router;
