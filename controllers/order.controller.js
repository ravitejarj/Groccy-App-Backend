const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const UserAddress = require("../models/address.model");

// ✅ Create Order with Cart + Address
exports.createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod = "Card" } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1. Load cart for user
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Load user's address
    const address = await UserAddress.findOne({ userId });
    if (!address) return res.status(400).json({ error: "No address found" });

    // 3. Create order document
    const order = new Order({
      userId,
      vendorId: cart.vendorId,
      items: cart.items,
      total: cart.total,
      subTotal: cart.total,       // or calculate separately if needed
      deliveryFee: 2.0,
      taxes: 0.5,
      paymentMethod,
      status: "confirmed",
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    await order.save();

    // 4. Clear cart
    await Cart.deleteMany({ userId });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("❌ createOrder error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Get all user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get vendor orders
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update order delivery status
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
