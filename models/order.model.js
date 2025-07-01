const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // 🔐 prevent duplicate/null orderIds
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: 'Card',
    },
    cardLast4: String,
    cardBrand: String,
    status: {
      type: String,
      default: 'confirmed',
    },
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
