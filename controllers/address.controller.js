// File: controllers/address.controller.js
const Address = require("../models/address.model");

// ✅ Get the current user's address
exports.getMyAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const address = await Address.findOne({ userId });
    if (!address) return res.status(404).json({ message: "No address found" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create or update the current user's address
exports.saveOrUpdateMyAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const updatedAddress = await Address.findOneAndUpdate(
      { userId },
      { ...req.body, userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
