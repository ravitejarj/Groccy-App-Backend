const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor.model');
const { calculateDistanceInMiles } = require('../utils/distance');
const vendorController = require('../controllers/vendor.controller');

// ✅ GET Nearby Vendors (with optional search by name)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, storeType, q } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchText = q?.toLowerCase() || '';

    // Filter by storeType and isActive
    const query = storeType ? { storeType, isActive: true } : { isActive: true };
    const vendors = await Vendor.find(query);

    // Enrich with calculated distance
    const enriched = vendors.map(v => {
      const distance = calculateDistanceInMiles(userLat, userLng, v.latitude, v.longitude);
      return {
        ...v._doc,
        distance,
      };
    });

    // Filter by distance and optional search query
    const filtered = enriched.filter(v => {
      const withinDistance = v.distance <= v.deliveryRadiusInMiles;
      const matchesSearch = searchText === '' || v.name.toLowerCase().includes(searchText);
      return withinDistance && matchesSearch;
    });

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching nearby vendors:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get vendor by ID (used by cart, product detail, etc.)
router.get('/:id', vendorController.getVendorById);

module.exports = router;
