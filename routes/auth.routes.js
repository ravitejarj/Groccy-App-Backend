const express = require('express');
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/change-password', verifyToken, authController.changePassword); // ⬅️ New

module.exports = router;
