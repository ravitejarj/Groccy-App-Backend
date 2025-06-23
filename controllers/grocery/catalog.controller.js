const GroceryVendorProduct = require("../../models/grocery/vendorProduct.model");
const Product = require("../../models/Product");
const GroceryCategory = require("../../models/grocery/category.model");
const GrocerySubcategory = require("../../models/grocery/subcategory.model");
const Vendor = require("../../models/vendor.model");

// ✅ GET /catalog/:vendorId/structure
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

// ✅ GET /catalog/:vendorId/products?subcategoryId=...
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
        stock: vendorData?.stock,
      };
    });

    res.json(enrichedProducts);
  } catch (err) {
    console.error("Error in getVendorCatalogProducts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔍 GET /catalog/:vendorId/search?query=cucumber
exports.searchVendorCatalogProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { query } = req.query;

    if (!vendorId || !query) {
      return res.status(400).json({ message: "Missing vendorId or query" });
    }

    const regex = new RegExp(query, "i");

    const results = await GroceryVendorProduct.find({
      vendorId,
      isActive: true,
      stock: { $gt: 0 },
      name: { $regex: regex },
    }).select("_id productId name price stock images subcategoryId");

    res.json(results);
  } catch (err) {
    console.error("Error in searchVendorCatalogProducts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /catalog/product/:productId?vendorId=...
exports.getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { vendorId } = req.query;

    console.log("📦 Getting groceryVendorProduct _id:", productId);
    console.log("🏪 With vendorId:", vendorId);

    // ✅ Fetch the vendor-specific product (with name, desc, images, etc.)
    const vendorProduct = await GroceryVendorProduct.findOne({
      _id: productId,
      vendorId,
      isActive: true,
    });

    if (!vendorProduct) {
      console.warn("❌ Vendor product not found for this vendorId + _id combo");
      return res.status(404).json({ message: "Vendor product not found" });
    }

    // ✅ Fetch category/subcategory names (optional but useful for UI)
    const category = await GroceryCategory.findById(vendorProduct.categoryId);
    const subcategory = await GrocerySubcategory.findById(vendorProduct.subcategoryId);

    // ✅ Optional: fetch vendor info (for branding on product screen)
    const vendor = await Vendor.findById(vendorId);

    res.json({
      _id: vendorProduct._id,
      name: vendorProduct.name,
      description: vendorProduct.description || "",
      images: vendorProduct.images || [],
      price: vendorProduct.price,
      stock: vendorProduct.stock,
      weight: vendorProduct.weight || "1 lb",
      categoryId: vendorProduct.categoryId,
      categoryName: category?.name || null,
      subcategoryId: vendorProduct.subcategoryId,
      subcategoryName: subcategory?.name || null,
      vendorName: vendor?.name || null,
      vendorLogo: vendor?.logo || null,
      isActive: vendorProduct.isActive,
      createdAt: vendorProduct.createdAt,
      updatedAt: vendorProduct.updatedAt,
    });
  } catch (err) {
    console.error("Error in getSingleProduct:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
