const GroceryVendorProduct = require('../../models/grocery/groceryvendorproduct.model');
const GrocerySubcategory = require('../../models/grocery/grocerysubcategory.model');

// ✅ Get all products for a vendor
const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const products = await GroceryVendorProduct.find({ vendorId, isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get a single product by ID
const getVendorProductById = async (req, res) => {
  try {
    const { vendorId, productId } = req.params;
    const product = await GroceryVendorProduct.findOne({ _id: productId, vendorId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get subcategories used by a vendor in a category
const getVendorSubcategoriesByCategory = async (req, res) => {
  try {
    const { vendorId, categoryId } = req.params;

    const products = await GroceryVendorProduct.find({ vendorId, categoryId });
    const subcategoryIds = [
      ...new Set(products.map((p) => p.subcategoryId).filter(Boolean))
    ];

    const subcategories = await GrocerySubcategory.find({ _id: { $in: subcategoryIds } });
    res.json({ subcategories });
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get products by vendor and subcategory
const getVendorProductsBySubcategory = async (req, res) => {
  try {
    const { vendorId, subcategoryId } = req.params;

    const products = await GroceryVendorProduct.find({
      vendorId,
      subcategoryId,
      isActive: true,
    });

    res.json({ products });
  } catch (err) {
    console.error('Error fetching products by subcategory:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getVendorProducts,
  getVendorProductById,
  getVendorSubcategoriesByCategory,
  getVendorProductsBySubcategory,
};
