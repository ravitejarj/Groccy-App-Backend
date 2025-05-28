const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinaryUpload");

// Single image upload
router.post("/single", upload.single("image"), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
