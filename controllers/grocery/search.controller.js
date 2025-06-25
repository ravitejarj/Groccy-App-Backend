// controllers/grocery/search.controller.js
const GroceryVendorProduct = require('../../models/grocery/groceryvendorproduct.model');

exports.searchVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { search } = req.query;

    const query = {
      vendorId,
      isActive: true,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await GroceryVendorProduct.find(query)
      .limit(10)
      .select('_id name price images');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};
