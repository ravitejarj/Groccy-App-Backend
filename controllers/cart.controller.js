const Cart = require('../models/cart.model');
const mongoose = require('mongoose');

// ➕ Add or Update Item in Cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, vendorId, productId, name, price, quantity } = req.body;

    if (!userId || !vendorId || !productId || !quantity || !name || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      vendorId: new mongoose.Types.ObjectId(vendorId),
    });

    if (!cart) {
      cart = new Cart({
        userId,
        vendorId,
        items: [{ productId, name, price, quantity }],
        total: price * quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, quantity });
      }

      cart.total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🧾 Get Cart by User ID (fixed with ObjectId conversion)
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!cart || cart.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🖊️ Update Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, vendorId, productId, quantity } = req.body;

    let cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      vendorId: new mongoose.Types.ObjectId(vendorId),
    });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ❌ Remove Item from Cart
exports.removeCartItem = async (req, res) => {
  try {
    const { userId, vendorId, productId } = req.body;

    let cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      vendorId: new mongoose.Types.ObjectId(vendorId),
    });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    // Recalculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed', cart });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🧹 Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
