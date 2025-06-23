// controllers/grocery/search.controller.js

const GroceryVendorProduct = require("../../models/grocery/vendorProduct.model");

/**
 * GET /catalog/:vendorId/search?query=...
 * Search vendor's grocery products by name (partial match)
 */
exports.searchVendorCatalogProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { query } = req.query;

    if (!vendorId || !query) {
      return res.status(400).json({ message: "Missing vendorId or query" });
    }

    const regex = new RegExp(query.trim(), "i");

    const results = await GroceryVendorProduct.find({
      vendorId,
      isActive: true,
      stock: { $gt: 0 },
      name: { $regex: regex },
    }).select(
      "_id name price stock images description subcategoryId categoryId productId"
    );

    res.json(results);
  } catch (err) {
    console.error("Error in searchVendorCatalogProducts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
