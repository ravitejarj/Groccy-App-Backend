const mongoose = require('mongoose');

const grocerySubcategorySchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  type: { type: String, default: 'grocery' },
  images: [{ type: String }],
  displayOrder: { type: Number, default: 0 }, // ✅ NEW FIELD
}, { timestamps: true });

module.exports = mongoose.model('GrocerySubcategory', grocerySubcategorySchema);
