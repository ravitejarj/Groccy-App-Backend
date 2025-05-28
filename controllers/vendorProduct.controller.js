const VendorProduct = require("../models/vendorProduct.model");

// Create a new product
exports.createVendorProduct = async (req, res) => {
  try {
    const product = new VendorProduct(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products (optionally filter by vendor)
exports.getVendorProducts = async (req, res) => {
  try {
    const filter = req.query.vendorId ? { vendorId: req.query.vendorId } : {};
    const products = await VendorProduct.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one product
exports.getVendorProductById = async (req, res) => {
  try {
    const product = await VendorProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
exports.updateVendorProduct = async (req, res) => {
  try {
    const updated = await VendorProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
exports.deleteVendorProduct = async (req, res) => {
  try {
    await VendorProduct.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
