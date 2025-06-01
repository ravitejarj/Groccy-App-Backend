const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor.model');
const { calculateDistanceInMiles } = require('../utils/distance');

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, storeType } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const query = storeType ? { storeType, isActive: true } : { isActive: true };
    const vendors = await Vendor.find(query);

    const enriched = vendors.map(v => {
      const distance = calculateDistanceInMiles(userLat, userLng, v.latitude, v.longitude);
      return {
        ...v._doc,
        distance,
      };
    });

    const filtered = enriched.filter(v => v.distance <= v.deliveryRadiusInMiles);

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching nearby vendors:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
