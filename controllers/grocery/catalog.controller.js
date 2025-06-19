const Vendor = require("../../models/vendor.model");
const Product = require("../../models/grocery/product.model");
const GroceryCategory = require("../../models/grocery/category.model");
const GrocerySubcategory = require("../../models/grocery/subcategory.model");
const GroceryVendorProduct = require("../../models/grocery/vendorProduct.model");

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

// ✅ GET /catalog/product/:id → includes vendorName
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    const vendorProduct = await GroceryVendorProduct.findOne({
      productId: id,
      isActive: true,
    });

    const category = await GroceryCategory.findById(product.categoryId);
    const subcategory = await GrocerySubcategory.findById(product.subcategoryId);

    let vendorName = null;
    if (vendorProduct?.vendorId) {
      const vendor = await Vendor.findById(vendorProduct.vendorId);
      vendorName = vendor?.name || null;
    }

    res.json({
      _id: product._id,
      name: product.name,
      description: product.description,
      images: product.images,
      price: vendorProduct?.price || null,
      stock: vendorProduct?.stock || 0,
      weight: vendorProduct?.weight || "1 lb",
      categoryId: product.categoryId,
      categoryName: category?.name || null,
      subcategoryId: product.subcategoryId,
      subcategoryName: subcategory?.name || null,
      vendorName,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (err) {
    console.error("Error in getSingleProduct:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
