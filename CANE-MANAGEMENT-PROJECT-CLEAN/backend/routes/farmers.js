import express from 'express';
import Farmer from '../models/Farmer.js';

const router = express.Router();

// Get all farmers
router.get('/', async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;
    const query = status ? { status } : {};
    const farmers = await Farmer.find(query)
      .sort({ lastDeliveryDate: -1 })
      .limit(parseInt(limit));
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get farmer by ID
router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create farmer
router.post('/', async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update farmer payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { status } = req.body;
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        paymentDate: status === 'Paid' ? new Date() : undefined 
      },
      { new: true }
    );
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get payment summary
router.get('/summary/payments', async (req, res) => {
  try {
    const totalPaid = await Farmer.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$netPayable' } } }
    ]);
    const totalPending = await Farmer.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$netPayable' } } }
    ]);
    res.json({
      paid: totalPaid[0]?.total || 0,
      pending: totalPending[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
