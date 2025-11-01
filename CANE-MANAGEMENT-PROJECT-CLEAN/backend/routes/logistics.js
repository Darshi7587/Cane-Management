import express from 'express';
import Logistics from '../models/Logistics.js';
import LogisticsPartner from '../models/LogisticsPartner.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get logistics partner profile (authenticated)
router.get('/profile', async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
    
    // Get user and verify role
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'logistics') {
      return res.status(403).json({ message: 'Access denied. Logistics role required.' });
    }

    // Get logistics partner profile
    const logisticsPartner = await LogisticsPartner.findOne({ email: user.email });
    if (!logisticsPartner) {
      return res.status(404).json({ message: 'Logistics partner profile not found' });
    }

    // Get active deliveries
    const activeDeliveries = await Logistics.find({ 
      status: 'in-transit'
    }).limit(10);

    // Get fleet status
    const fleetStatus = [
      { vehicleNumber: 'MH-12-AB-1234', type: 'Truck', status: 'operational', currentLocation: 'Mumbai Depot' },
      { vehicleNumber: 'MH-12-CD-5678', type: 'Truck', status: 'in-transit', currentLocation: 'En route to Factory' },
      { vehicleNumber: 'MH-12-EF-9012', type: 'Truck', status: 'maintenance', currentLocation: 'Service Center' },
    ];

    // Mock pending pickups (you can create a proper model for this)
    const pendingPickups = [
      {
        id: '1',
        farmerName: 'Rajesh Kumar',
        location: 'Pune District',
        tons: 25,
        urgency: 'high',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        farmerName: 'Amit Patel',
        location: 'Nashik District',
        tons: 18,
        urgency: 'medium',
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Calculate completed this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const completedThisMonth = await Logistics.countDocuments({
      status: 'delivered',
      arrivalTime: { $gte: startOfMonth }
    });

    res.json({
      companyName: logisticsPartner.companyName,
      email: logisticsPartner.email,
      contactPerson: logisticsPartner.contactPerson,
      fleetSize: logisticsPartner.fleetSize || 15,
      activeVehicles: logisticsPartner.fleetSize - 2 || 12,
      activeDeliveries: logisticsPartner.activeDeliveries || activeDeliveries.length,
      completedThisMonth: logisticsPartner.completedDeliveries || completedThisMonth,
      rating: logisticsPartner.rating || 4.5,
      recentDeliveries: activeDeliveries.map(delivery => ({
        id: delivery._id,
        vehicleNumber: delivery.vehicleNumber,
        destination: delivery.destination,
        eta: delivery.estimatedArrival,
        status: delivery.status,
        lat: delivery.gpsCoordinates?.latitude,
        lng: delivery.gpsCoordinates?.longitude
      })),
      pendingPickups,
      fleetStatus
    });

  } catch (error) {
    console.error('Error fetching logistics profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch logistics profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const vehicles = await Logistics.find(query).sort({ departureTime: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Logistics.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create vehicle entry
router.post('/', async (req, res) => {
  try {
    const vehicle = new Logistics(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update vehicle status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, gpsCoordinates } = req.body;
    const updateData = { status };
    
    if (gpsCoordinates) {
      updateData.gpsCoordinates = gpsCoordinates;
    }
    
    if (status === 'Delivered') {
      updateData.arrivalTime = new Date();
    }
    
    const vehicle = await Logistics.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get logistics summary
router.get('/summary/stats', async (req, res) => {
  try {
    const totalVehicles = await Logistics.countDocuments();
    const inTransit = await Logistics.countDocuments({ status: 'In Transit' });
    const delivered = await Logistics.countDocuments({ status: 'Delivered' });
    
    res.json({
      total: totalVehicles,
      inTransit,
      delivered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
