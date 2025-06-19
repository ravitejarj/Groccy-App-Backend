const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  images: [String],
  categoryId: String,
  subcategoryId: String,
  type: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Product", productSchema);
