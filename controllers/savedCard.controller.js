const SavedCard = require("../models/savedCard.model");

// Get all saved cards for a user
exports.getSavedCards = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cards = await SavedCard.find({ userId });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save a new card
exports.addSavedCard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { brand, last4, paymentMethodId, isDefault } = req.body;

    if (isDefault) {
      // Set all other cards to false
      await SavedCard.updateMany({ userId }, { isDefault: false });
    }

    const newCard = new SavedCard({
      userId,
      brand,
      last4,
      paymentMethodId,
      isDefault: isDefault || false,
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a saved card
exports.deleteSavedCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user.userId;

    const deleted = await SavedCard.findOneAndDelete({ _id: cardId, userId });
    if (!deleted) return res.status(404).json({ message: "Card not found" });

    res.json({ message: "Card deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
