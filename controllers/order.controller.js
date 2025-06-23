const Order = require("../models/order.model");
const Vendor = require("../models/vendor.model");
const Cart = require("../models/cart.model");
const VendorProduct = require("../models/grocery/vendorProduct.model"); // ✅ New import

exports.createOrder = async (req, res) => {
  try {
    const { userId, vendorId, items, total, paymentMethod, street, city, state, zipCode } = req.body;

    const newOrder = new Order({
      userId,
      vendorId,
      items,
      total,
      paymentMethod,
      street,
      city,
      state,
      zipCode,
      status: "Placed",
    });

    const savedOrder = await newOrder.save();

    // Optional: clear cart after order
    await Cart.deleteMany({ userId, vendorId });

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const vendor = await Vendor.findById(order.vendorId);
        const detailedItems = await Promise.all(
          order.items.map(async (item) => {
            const product = await VendorProduct.findById(item.productId);
            return {
              ...item.toObject(),
              image: product?.images?.[0] || null,
              description: product?.description || "",
            };
          })
        );

        return {
          ...order.toObject(),
          vendorName: vendor?.name || "Unknown Vendor",
          vendorLogo: vendor?.logo || null,
          items: detailedItems,
        };
      })
    );

    res.json(enrichedOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const orders = await Order.find({ vendorId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
