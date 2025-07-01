const Order = require('../models/order.model');

// Get all orders for a user (Order Tab)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // latest orders first
      .lean();

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('❌ Failed to fetch user orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
