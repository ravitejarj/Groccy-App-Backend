const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g. doctor, club
  category: { type: String },
  contact: { type: String },
  email: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema, "services");
