const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // e.g., Pending, Processing, Delivered
  paymentMethod: { type: String, default: 'card' },
  street: String,
  city: String,
  state: String,
  zipCode: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
