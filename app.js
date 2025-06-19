const express = require("express");

const app = express();
app.use(express.json());

// Import all route files
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const groceryCatalogRoutes = require("./routes/grocery/catalog.routes");
const vendorRoutes = require("./routes/vendor.routes");
const groceryVendorProductRoutes = require("./routes/grocery/vendorProduct.routes");

const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");

const uploadRoutes = require("./routes/upload.routes");
const serviceRoutes = require("./routes/service.routes");

const addressRoutes = require("./routes/address.routes");
const savedCardRoutes = require("./routes/savedCard.routes");

const ratingRoutes = require("./routes/rating.routes");
const notificationRoutes = require("./routes/notification.routes");

// Use all routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/vendor-products", groceryVendorProductRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/catalog", groceryCatalogRoutes);
app.use("/api/savedcards", savedCardRoutes);

// Health check root endpoint
app.get("/", (req, res) => res.send("Groccy backend running"));

module.exports = app;