const Vendor = require("../models/vendor.model");

// Create vendor
exports.createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all vendors
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one vendor
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Haversine filter: GET /vendors/nearby?lat=...&lng=...
function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.getNearbyVendors = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "Missing coordinates" });

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const vendors = await Vendor.find({ isActive: true });

    const nearby = vendors.filter(v => {
      if (v.latitude && v.longitude && v.deliveryRadiusInMiles) {
        const dist = getDistanceFromLatLonInMiles(userLat, userLng, v.latitude, v.longitude);
        return dist <= v.deliveryRadiusInMiles;
      }
      return false;
    });

    res.json(nearby);
  } catch (err) {
    console.error("Nearby vendor error:", err);
    res.status(500).json({ error: "Failed to fetch nearby vendors" });
  }
};
