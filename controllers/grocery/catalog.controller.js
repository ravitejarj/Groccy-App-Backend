const GroceryVendorProduct = require('../../models/grocery/groceryvendorproduct.model');
const GroceryCategory = require('../../models/grocery/grocerycategory.model');
const GrocerySubcategory = require('../../models/grocery/grocerysubcategory.model');
const redisClient = require('../../config/redis');

exports.getCatalogStructureByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const redisKey = `catalog_structure_${vendorId}`;

    // Check cache
    const cached = await redisClient.get(redisKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const products = await GroceryVendorProduct.find({ vendorId });

    const categoryIds = [...new Set(products.map(p => p.categoryId))];
    const subcategoryIds = [...new Set(products.map(p => p.subcategoryId))];

    const categories = await GroceryCategory.find({ _id: { $in: categoryIds } }).sort({ displayOrder: 1 });
    const subcategories = await GrocerySubcategory.find({ _id: { $in: subcategoryIds } }).sort({ displayOrder: 1 });

    const response = { categories, subcategories };

    // Cache it for 10 minutes (600 sec)
    await redisClient.setEx(redisKey, 600, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load catalog structure', error });
  }
};
