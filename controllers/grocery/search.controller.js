// controllers/grocery/search.controller.js
const GroceryVendorProduct = require('../../models/grocery/groceryvendorproduct.model');

exports.searchVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { search, categoryId, subcategoryId } = req.query;

    const query = {
      vendorId,
      isActive: true,
    };

    if (categoryId) query.categoryId = categoryId;
    if (subcategoryId) query.subcategoryId = subcategoryId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await GroceryVendorProduct.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};
