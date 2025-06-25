const express = require("express");

const app = express();
app.use(express.json());

// Import all route files
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const addressRoutes = require("./routes/address.routes");
const savedCardRoutes = require("./routes/savedCard.routes");
const notificationRoutes = require("./routes/notification.routes");

const vendorRoutes = require("./routes/vendor.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

// ✅ Grocery-specific
const searchRoutes = require('./routes/grocery/search.routes');
const catalogRoutes = require('./routes/grocery/catalog.routes');
const groceryProductRoutes = require('./routes/grocery/groceryVendorProduct.routes');

// Use all routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/savedcards", savedCardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ✅ New grocery routes
app.use('/api', catalogRoutes);
app.use('/api/grocery/search', searchRoutes);
app.use('/api', groceryProductRoutes);

// Health check
app.get("/", (req, res) => res.send("Groccy backend running"));

module.exports = app;