import express from 'express';
import Sustainability from '../models/Sustainability.js';

const router = express.Router();

// Get latest sustainability metrics
router.get('/current', async (req, res) => {
  try {
    const current = await Sustainability.findOne().sort({ date: -1 });
    if (!current) {
      return res.status(404).json({ message: 'No sustainability data found' });
    }
    res.json(current);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sustainability history
router.get('/history', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const history = await Sustainability.find({
      date: { $gte: startDate }
    }).sort({ date: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create sustainability entry
router.post('/', async (req, res) => {
  try {
    const sustainability = new Sustainability(req.body);
    await sustainability.save();
    res.status(201).json(sustainability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
