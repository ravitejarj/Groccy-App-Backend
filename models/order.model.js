const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "GroceryVendorProduct" },
  name: String,
  price: Number,
  quantity: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    default: "confirmed", // confirmed, dispatched, delivered, cancelled
  },
  paymentMethod: {
    type: String,
    enum: ["Card"],
    default: "Card"
  },
  street: String,
  city: String,
  state: String,
  zipCode: String
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema, "orders");
