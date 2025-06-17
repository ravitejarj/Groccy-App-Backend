const Order = require('../models/order.model');
const GroceryVendorProduct = require('../models/groceryVendorProduct.model');
const RestaurantVendorProduct = require('../models/restaurantVendorProduct.model');
const Product = require('../models/Product');

exports.getOrdersTabData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            let vendorProduct = await GroceryVendorProduct.findById(item.productId);
            let type = 'grocery';

            if (!vendorProduct) {
              vendorProduct = await RestaurantVendorProduct.findById(item.productId);
              type = 'restaurant';
            }

            let productData = null;
            if (vendorProduct && vendorProduct.productId) {
              productData = await Product.findById(vendorProduct.productId);
            }

            return {
              name: productData?.name || item.name || 'Unknown',
              quantity: item.quantity,
              price: item.price,
              image:
                productData?.images?.[0] ||
                'https://res.cloudinary.com/dh5liqius/image/upload/v1716406939/groccy/temp/dummy.png',
              type,
            };
          })
        );

        return {
          _id: order._id,
          orderId: order.orderId,
          vendorId: order.vendorId,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt,
          items: enrichedItems,
        };
      })
    );

    res.json(enrichedOrders);
  } catch (err) {
    console.error('❌ getOrdersTabData error:', err);
    res.status(500).json({ error: 'Failed to fetch orders tab data' });
  }
};
