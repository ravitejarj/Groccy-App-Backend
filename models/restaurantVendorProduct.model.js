const mongoose = require("mongoose");

const restaurantVendorProductSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    weight: {
      type: String, // Example: "1 lb" or "500 g"
      default: "1 lb",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ✅ Fixed: Correct model name
module.exports = mongoose.model("RestaurantVendorProduct", restaurantVendorProductSchema);
