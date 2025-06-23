const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const UserAddress = require('../models/address.model');
const Vendor = require('../models/vendor.model');
const { calculateDistanceInMiles } = require('../utils/distance');

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
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 6. Create new order
    const newOrder = new Order({
      userId,
      vendorId,
      items: cart.items,
      total,
      paymentMethod,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    await newOrder.save();

    // 7. Clear cart
    await Cart.deleteOne({ _id: cart._id });

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrder._id,
      total,
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
};

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
