const Address = require("../models/address.model");

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const address = new Address({
      ...req.body,
      userId: req.body.userId || '665c06e5f5177c2b4b16d2e8', // 🛠 Replace with valid test user _id
    });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all addresses of a user
exports.getUserAddresses = async (req, res) => {
  try {
    const address = await Address.findOne({ userId: req.params.userId });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an address
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

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
