const GroceryCategory = require("../../models/grocery/category.model");
const GrocerySubcategory = require("../../models/grocery/subcategory.model");
const Product = require("../../models/grocery/product.model");
const GroceryVendorProduct = require("../../models/grocery/vendorProduct.model");


// 🔍 1. Search Grocery Categories
const searchCategories = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const regex = new RegExp(query, "i");
    const results = await GroceryCategory.find({ name: regex, isActive: true });

    res.json(results);
  } catch (err) {
    console.error("Category search error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// 🔍 2. Search Grocery Subcategories
const searchSubcategories = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const regex = new RegExp(query, "i");
    const results = await GrocerySubcategory.find({ name: regex, isActive: true });

    res.json(results);
  } catch (err) {
    console.error("Subcategory search error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// 🔍 3. Search Products by name + vendorId
const searchProductsByVendor = async (req, res) => {
  try {
    const { query, vendorId } = req.query;
    if (!query || !vendorId) {
      return res.status(400).json({ message: "Query and vendorId are required" });
    }

    const regex = new RegExp(query, "i");

    // Step 1: Find matching products
    const matchedProducts = await Product.find({ name: regex, isActive: true });

    const matchedProductIds = matchedProducts.map(p => p._id);

    // Step 2: Find vendor products linked to those products
    const vendorProducts = await GroceryVendorProduct.find({
      vendorId,
      productId: { $in: matchedProductIds },
    });

    // Step 3: Merge and respond
    const results = vendorProducts.map(vp => {
      const product = matchedProducts.find(p => p._id.toString() === vp.productId.toString());
      return {
        vendorProductId: vp._id,
        productId: vp.productId,
        name: product?.name || "Unnamed",
        description: product?.description || "",
        images: product?.images || [],
        price: vp.price,
        stock: vp.stock,
        categoryId: product?.categoryId,
        subcategoryId: product?.subcategoryId,
        vendorId: vp.vendorId,
      };
    });

    res.json(results);
  } catch (err) {
    console.error("Product search error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Export all handlers
module.exports = {
  searchCategories,
  searchSubcategories,
  searchProductsByVendor,
};
