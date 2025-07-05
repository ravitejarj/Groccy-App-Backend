// File: controllers/address.controller.js

const Address = require("../models/address.model");

// ✅ Create new address securely (no hardcoded userId)
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from JWT token

    const address = new Address({
      ...req.body,
      userId, // securely injected
    });

    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get ALL addresses of a user
exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update an address
exports.updateAddress = async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
