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

// ✅ Fix: model name for `ref` + collection name
module.exports = mongoose.model(
  "GroceryVendorProduct",           // Mongoose model name (used in ref)
  vendorProductSchema,
  "groceryvendorproducts"          // Actual MongoDB collection name
);
