const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const UserAddress = require('../models/address.model');

// ✅ Create Order from Cart
exports.createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod = 'Card' } = req.body;

    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const address = await UserAddress.findOne({ userId });
    if (!address) {
      return res.status(400).json({ error: 'No address found' });
    }

    const today = new Date();
    const datePart = today.toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    const generatedOrderId = `ORD-${datePart}-${randomPart}`;

    const order = new Order({
      orderId: generatedOrderId,
      userId,
      vendorId: cart.vendorId,
      items: cart.items,
      total: cart.total,
      subTotal: cart.total,
      deliveryFee: 2.0,
      taxes: 0.5,
      paymentMethod,
      status: 'confirmed',
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    await order.save();
    await Cart.deleteMany({ userId });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('❌ createOrder error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ✅ Get All Orders for a User
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Orders for a Vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Order by `orderId` (for OrderSuccess screen)
exports.getOrderByOrderId = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('vendorId', 'name') // just get store name
      .populate('items.productId', 'name');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('❌ getOrderByOrderId error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
