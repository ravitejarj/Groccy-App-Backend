// models/savedCard.model.js

const mongoose = require('mongoose');

const savedCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: String,
      required: true, // e.g. Visa, MasterCard
    },
    last4: {
      type: String,
      required: true, // e.g. 1234
    },
    paymentMethodId: {
      type: String,
      required: true, // Stripe payment method ID
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('SavedCard', savedCardSchema);
