const Cart = require("../models/cart.model");

// Get cart by userId (one per vendor)
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update cart
exports.saveCart = async (req, res) => {
  try {
    const { userId, vendorId, items } = req.body;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let cart = await Cart.findOne({ userId, vendorId });

    if (cart) {
      cart.items = items;
      cart.total = total;
      cart.updatedAt = new Date();
    } else {
      cart = new Cart({ userId, vendorId, items, total });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete cart by userId
exports.deleteCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
