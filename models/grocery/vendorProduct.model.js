const mongoose = require("mongoose");

const vendorProductSchema = new mongoose.Schema(
  {
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

    // 🆕 Product details copied from `products`
    name: { type: String },
    description: { type: String },
    categoryId: { type: String },
    subcategoryId: { type: String },
    images: [{ type: String }],

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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model(
  "GroceryVendorProduct",           // Mongoose model name (used in code)
  vendorProductSchema,
  "groceryvendorproducts"          // MongoDB collection name
);
