const User = require("../models/user.model");
const redisClient = require("../config/redis");
const jwt = require("jsonwebtoken");

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
const OTP_EXPIRY = 300; // 5 minutes

// ✅ Send OTP (dummy)
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ message: "Phone number required" });

  const otp = generateOtp();
  await redisClient.setEx(`otp:${phone}`, OTP_EXPIRY, otp);

  console.log(`📲 [DUMMY OTP] for ${phone}: ${otp}`);
  res.status(200).json({ message: "OTP sent successfully (dummy)", otp }); // Show OTP for dev only
};

// ✅ Verify OTP and Login or Create User
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

  const storedOtp = await redisClient.get(`otp:${phone}`);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = new User({ phone });
    await user.save();
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user,
  });
};
