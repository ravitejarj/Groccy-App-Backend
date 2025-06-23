const Order = require("../models/order.model");
const GroceryVendorProduct = require("../models/grocery/vendorProduct.model");
const RestaurantVendorProduct = require("../models/restaurantVendorProduct.model");

const getOrdersTabData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            let type = 'grocery';
            let vendorProduct = await GroceryVendorProduct.findById(item.productId);

            if (!vendorProduct) {
              vendorProduct = await RestaurantVendorProduct.findById(item.productId);
              type = 'restaurant';
            }

            return {
              name: item.name || vendorProduct?.name || 'Unknown',
              quantity: item.quantity,
              price: item.price,
              image: vendorProduct?.images?.[0] || item.image || 'https://res.cloudinary.com/dh5liqius/image/upload/v1716406939/groccy/temp/dummy.png',
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
          cardBrand: order.cardBrand || '',
          cardLast4: order.cardLast4 || '',
          items: enrichedItems,
        };
      })
    );

    res.json(enrichedOrders);
  } catch (err) {
    console.error("❌ getOrdersTabData error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  getOrdersTabData,
};
