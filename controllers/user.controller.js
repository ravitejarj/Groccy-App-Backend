const User = require("../models/user.model");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    // Do not allow updating to empty phone or duplicate phone
    if (updates.phone) {
      const exists = await User.findOne({ phone: updates.phone, _id: { $ne: req.params.id } });
      if (exists) return res.status(400).json({ message: "Phone number already in use" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
