const express = require('express');
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;