const mongoose = require("mongoose");

const vendorProductSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String, // ✅ Used for search
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model(
  "GroceryVendorProduct",
  vendorProductSchema,
  "groceryvendorproducts"
);
