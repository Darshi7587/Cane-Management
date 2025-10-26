import express from 'express';
import Logistics from '../models/Logistics.js';

const router = express.Router();

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
