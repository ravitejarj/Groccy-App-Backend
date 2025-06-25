const GroceryVendorProduct = require('../../models/grocery/groceryvendorproduct.model');
const GroceryCategory = require('../../models/grocery/grocerycategory.model');
const GrocerySubcategory = require('../../models/grocery/grocerysubcategory.model');
const redisClient = require('../../config/redis');

exports.getCatalogStructureByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const redisKey = `catalog_structure_${vendorId}`;

    // 🔁 Check cache
    const cached = await redisClient.get(redisKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 📦 Get all products for this vendor
    const products = await GroceryVendorProduct.find({ vendorId });

    // 🧠 Extract used category and subcategory IDs
    const usedCategoryIds = new Set(products.map(p => p.categoryId));
    const usedSubcategoryIds = new Set(products.map(p => p.subcategoryId));

    // ✅ Get ALL categories and subcategories (sorted)
    const categories = await GroceryCategory.find().sort({ displayOrder: 1 });
    const subcategories = await GrocerySubcategory.find().sort({ displayOrder: 1 });

    // 🟢 Add `hasProducts` flag to each category and subcategory
    const enrichedCategories = categories.map(cat => ({
      ...cat.toObject(),
      hasProducts: usedCategoryIds.has(cat._id),
    }));

    const enrichedSubcategories = subcategories.map(sub => ({
      ...sub.toObject(),
      hasProducts: usedSubcategoryIds.has(sub._id),
    }));

    const response = {
      categories: enrichedCategories,
      subcategories: enrichedSubcategories,
    };

    // 💾 Cache for 10 minutes
    await redisClient.setEx(redisKey, 600, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('❌ Error in getCatalogStructureByVendor:', error);
    res.status(500).json({ message: 'Failed to load catalog structure', error });
  }
};
