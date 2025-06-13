const Cart = require("../models/cart.model");
const VendorProduct = require("../models/groceryVendorProduct.model");
const Product = require("../models/Product");

// ✅ Add or update cart item
exports.addToCart = async (req, res) => {
  try {
    const { userId, vendorId, productId, name, price, quantity } = req.body;

    if (!userId || !vendorId || !productId || !name || !price || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const productPrice = parseFloat(price);
    if (isNaN(productPrice)) {
      return res.status(400).json({ error: "Invalid price format" });
    }

    let cart = await Cart.findOne({ userId, vendorId });

    if (!cart) {
      cart = new Cart({
        userId,
        vendorId,
        items: [{ productId, name, price: productPrice, quantity }],
        total: parseFloat((productPrice * quantity).toFixed(2)),
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = productPrice;
      } else {
        cart.items.push({ productId, name, price: productPrice, quantity });
      }

      cart.total = parseFloat(
        cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
      );
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// ✅ Get cart with product image (updated to use Product collection)
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

    const cart = await Cart.findOne({ userId, vendorId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;

    cart.total = parseFloat(
      cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
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

    cart.total = parseFloat(
      cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
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
