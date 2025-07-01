const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const UserAddress = require('../models/address.model');
const Vendor = require('../models/vendor.model');
const { calculateDistanceInMiles } = require('../utils/distance');

// ✅ Native Date-Based Order ID Generator (no moment)
const generateOrderId = () => {
  try {
    const now = new Date();
    const datePart = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${datePart}-${randomPart}`;
  } catch (err) {
    console.error('❌ Failed to generate orderId:', err);
    return `ORD-${Date.now()}`;
  }
};

// ✅ Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, vendorId, addressId, paymentMethod = 'card' } = req.body;

    // 1. Get the cart
    const cart = await Cart.findOne({ userId, vendorId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Get the address
    const address = await UserAddress.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // 3. Get the vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // 4. Check delivery distance
    const distance = calculateDistanceInMiles(
      address.lat,
      address.lng,
      vendor.latitude,
      vendor.longitude
    );

    if (distance > vendor.deliveryRadiusInMiles) {
      return res.status(403).json({
        message: `Your address is ${distance.toFixed(2)} miles away, which exceeds the vendor's delivery radius of ${vendor.deliveryRadiusInMiles} miles.`,
      });
    }

    // 5. Calculate total
    const subTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2;
    const taxes = 0.5;
    const total = subTotal + deliveryFee + taxes;

    // 6. Create new order
    const newOrder = new Order({
      orderId: generateOrderId(), // ✅ Always set
      userId,
      vendorId,
      items: cart.items,
      subTotal,
      deliveryFee,
      taxes,
      total,
      paymentMethod,
      cardLast4: '4444', // optional: replace with real if integrated
      cardBrand: 'MasterCard',
      status: 'confirmed',
      street: address.street,
      apartment: address.apartment,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    await newOrder.save();

    // 7. Clear cart
    await Cart.deleteOne({ _id: cart._id });

    // ✅ Response with fallback
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrder.orderId || newOrder._id,
      total: newOrder.total,
      order: newOrder,
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
};

// ✅ Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};

// ✅ Get order by Order ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('vendorId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};
