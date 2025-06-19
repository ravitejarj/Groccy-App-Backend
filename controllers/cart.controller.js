const Cart = require("../models/cart.model");
const GroceryVendorProduct = require('../models/grocery/vendorProduct.model');
const Product = require("../models/grocery/product.model");

// ✅ Add or update cart item (always add +1)
exports.addToCart = async (req, res) => {
  try {
    const { userId, vendorId, productId, name, price } = req.body;

    if (!userId || !vendorId || !productId || !name || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: "Invalid price format" });
    }

    let cart = await Cart.findOne({ userId, vendorId });

    if (!cart) {
      cart = new Cart({
        userId,
        vendorId,
        items: [{ productId, name, price: parsedPrice, quantity: 1 }],
        total: parsedPrice,
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, name, price: parsedPrice, quantity: 1 });
      }

      cart.total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// ✅ Get cart with product image
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.find({ userId });

    const populated = await Promise.all(
      cart.map(async (entry) => {
        const detailedItems = await Promise.all(
          entry.items.map(async (item) => {
            const productMaster = await Product.findById(item.productId);
            return {
              ...item.toObject(),
              image: productMaster?.images?.[0] || null,
            };
          })
        );

        return {
          ...entry.toObject(),
          items: detailedItems,
        };
      })
    );

    res.json(populated);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// ✅ Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, vendorId, productId, quantity } = req.body;

    if (!userId || !vendorId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId, vendorId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (quantity <= 0) {
      // Optional: remove item if quantity is zero
      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
};

// ✅ Remove single item
exports.removeCartItem = async (req, res) => {
  try {
    const { userId, vendorId, productId } = req.body;

    const cart = await Cart.findOne({ userId, vendorId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

// ✅ Clear all items
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
