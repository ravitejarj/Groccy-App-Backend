const Cart = require("../models/cart.model");
const VendorProduct = require("../models/grocery/groceryvendorproduct.model");

// ✅ Add or update cart item without replacing full cart
const addToCart = async (req, res) => {
  try {
    const { userId, vendorId, productId, name, price } = req.body;

    if (!userId || !vendorId || !productId || !name || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: "Invalid price format" });
    }

    // 🔍 Check if user already has a cart for this vendor
    let cart = await Cart.findOne({ userId, vendorId });

    if (!cart) {
      // 🆕 New cart for this vendor
      cart = new Cart({
        userId,
        vendorId,
        items: [{ productId, name, price: parsedPrice, quantity: 1 }],
        total: parsedPrice,
      });
    } else {
      // ✅ Check if product already in cart
      const existingIndex = cart.items.findIndex(
        (i) => i.productId.toString() === productId
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += 1;
      } else {
        cart.items.push({
          productId,
          name,
          price: parsedPrice,
          quantity: 1,
        });
      }

      // 🧮 Recalculate total
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

// ✅ Get cart with image and description (all vendor carts)
const getAllCartsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.find({ userId });

    const populated = await Promise.all(
      cart.map(async (entry) => {
        const detailedItems = await Promise.all(
          entry.items.map(async (item) => {
            const productMaster = await VendorProduct.findById(item.productId);
            return {
              ...item.toObject(),
              image: productMaster?.images?.[0] || null,
              description: productMaster?.description || "",
              categoryId: productMaster?.categoryId || null,
              subcategoryId: productMaster?.subcategoryId || null,
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

// ✅ NEW: Get cart for specific user and vendor
const getCartByUserAndVendor = async (req, res) => {
  try {
    const { userId, vendorId } = req.params;

    const cart = await Cart.findOne({ userId, vendorId });
    if (!cart) return res.json(null);

    const detailedItems = await Promise.all(
      cart.items.map(async (item) => {
        const productMaster = await VendorProduct.findById(item.productId);
        return {
          ...item.toObject(),
          image: productMaster?.images?.[0] || null,
          description: productMaster?.description || '',
          categoryId: productMaster?.categoryId || null,
          subcategoryId: productMaster?.subcategoryId || null,
        };
      })
    );

    res.json({
      ...cart.toObject(),
      items: detailedItems,
    });
  } catch (err) {
    console.error('Get vendor cart error:', err);
    res.status(500).json({ error: 'Failed to fetch vendor cart' });
  }
};

// ✅ Update item quantity
const updateCartItem = async (req, res) => {
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
const removeCartItem = async (req, res) => {
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

// ✅ Clear entire cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

// ✅ Export all
module.exports = {
  addToCart,
  getAllCartsByUser,          // old route (optional)
  getCartByUserAndVendor,     // new vendor-specific cart
  updateCartItem,
  removeCartItem,
  clearCart,
};
