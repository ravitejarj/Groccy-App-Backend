const GroceryVendorProduct = require("../models/groceryVendorProduct.model");
const Product = require("../models/Product");
const GroceryCategory = require("../models/groceryCategory.model");
const GrocerySubcategory = require("../models/grocerySubcategory.model");

// GET /catalog/:vendorId/structure
exports.getVendorStructure = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendorProducts = await GroceryVendorProduct.find(
      { vendorId, isActive: true },
      "productId"
    );

    const productIds = vendorProducts.map(vp => vp.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const categoryIds = [...new Set(products.map(p => p.categoryId))];
    const subcategoryIds = [...new Set(products.map(p => p.subcategoryId))];

    const categories = await GroceryCategory.find({ _id: { $in: categoryIds } });
    const subcategories = await GrocerySubcategory.find({ _id: { $in: subcategoryIds } });

    res.json({ categories, subcategories });
  } catch (err) {
    console.error("Error in getVendorStructure:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /catalog/:vendorId/products?subcategoryId=...
exports.getVendorCatalogProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { subcategoryId } = req.query;

    if (!subcategoryId) {
      return res.status(400).json({ message: "subcategoryId is required" });
    }

    const vendorItems = await GroceryVendorProduct.find({ vendorId, isActive: true });
    const productIds = vendorItems.map(vp => vp.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      subcategoryId,
      isActive: true
    });

    const enrichedProducts = products.map(product => {
      const vendorData = vendorItems.find(
        vp => vp.productId.toString() === product._id.toString()
      );

      return {
        ...product.toObject(),
        price: vendorData?.price,
        stock: vendorData?.stock
      };
    });

    res.json(enrichedProducts);
  } catch (err) {
    console.error("Error in getVendorCatalogProducts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
