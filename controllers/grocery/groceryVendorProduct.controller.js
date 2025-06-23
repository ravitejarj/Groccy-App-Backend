const GroceryVendorProduct = require('../../models/grocery/groceryvendorproduct.model');
const { DEFAULT_PRODUCT_IMAGE } = require('../../constants');

exports.getVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { categoryId, subcategoryId, page = 1, limit = 20 } = req.query;

    const query = {
      vendorId,
      isActive: true,
    };
    if (categoryId) query.categoryId = categoryId;
    if (subcategoryId) query.subcategoryId = subcategoryId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, totalCount] = await Promise.all([
      GroceryVendorProduct.find(query).skip(skip).limit(parseInt(limit)),
      GroceryVendorProduct.countDocuments(query),
    ]);

    // Add fallback image if missing
    const enriched = products.map(product => {
      const productObj = product.toObject();
      if (!productObj.images || productObj.images.length === 0) {
        productObj.images = [DEFAULT_PRODUCT_IMAGE];
      }
      return productObj;
    });

    res.json({
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      products: enriched,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get products', error });
  }
};

exports.getVendorProductById = async (req, res) => {
  try {
    const { vendorId, productId } = req.params;
    const product = await GroceryVendorProduct.findOne({ _id: productId, vendorId });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const productObj = product.toObject();
    if (!productObj.images || productObj.images.length === 0) {
      productObj.images = [DEFAULT_PRODUCT_IMAGE];
    }

    res.json(productObj);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get product detail', error });
  }
};
