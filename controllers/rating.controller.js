const Rating = require("../models/rating.model");

exports.createRating = async (req, res) => {
  try {
    const rating = new Rating(req.body);
    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingsForVendor = async (req, res) => {
  try {
    const ratings = await Rating.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingByUser = async (req, res) => {
  try {
    const rating = await Rating.findOne({ userId: req.params.userId, vendorId: req.params.vendorId });
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
