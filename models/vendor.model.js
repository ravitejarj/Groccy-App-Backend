const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String },
    storeType: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    image: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    deliveryRadiusInMiles: { type: Number, default: 20 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
