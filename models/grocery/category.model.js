const mongoose = require("mongoose");

const groceryCategorySchema = new mongoose.Schema({
  _id: String, // like "vegetables_fruits"
  name: String,
  type: String, // "grocery"
  parentId: String, // null or string
  images: [String],
});

module.exports = mongoose.model("grocerycategories", groceryCategorySchema);
