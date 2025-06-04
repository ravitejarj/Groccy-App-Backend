const mongoose = require("mongoose");

const grocerySubcategorySchema = new mongoose.Schema({
  _id: String, // like "vegetables"
  name: String,
  categoryId: String, // "vegetables_fruits"
  type: String, // "grocery"
  images: [String],
});

module.exports = mongoose.model("grocerysubcategories", grocerySubcategorySchema);
