const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "GroceryVendorProduct" },
  name: String,
  price: Number,
  quantity: Number,
  image: String, // ✅ New field added
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
  subTotal: { type: Number }, // Optional if needed
  deliveryFee: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },

  paymentMethod: {
    type: String,
    enum: ["Card"],
    default: "Card"
  },
  cardLast4: { type: String }, // ✅ New field added
  cardBrand: { type: String }, // ✅ New field added

  status: {
    type: String,
    default: "confirmed", // confirmed, dispatched, delivered, cancelled
  },

  street: String,
  apartment: String,
  city: String,
  state: String,
  zipCode: String
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema, "orders");
