require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

// Load environment variables early (already done above)
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));