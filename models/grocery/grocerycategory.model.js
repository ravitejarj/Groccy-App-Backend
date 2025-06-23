const mongoose = require('mongoose');

const groceryCategorySchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  type: { type: String, default: 'grocery' },
  parentId: { type: String, default: null },
  images: [{ type: String }],
  displayOrder: { type: Number, default: 0 }, // ✅ NEW FIELD
}, { timestamps: true });

module.exports = mongoose.model('GroceryCategory', groceryCategorySchema);
