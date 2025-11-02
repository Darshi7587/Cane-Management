import express from 'express';
import Distillery from '../models/Distillery.js';

const router = express.Router();

// Get current distillery status
router.get('/current', async (req, res) => {
  try {
    const current = await Distillery.findOne().sort({ timestamp: -1 });
    if (!current) {
      return res.status(404).json({ message: 'No distillery data found' });
    }
    res.json(current);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get distillery history
router.get('/history', async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    const history = await Distillery.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create distillery entry
router.post('/', async (req, res) => {
  try {
    const distillery = new Distillery(req.body);
    await distillery.save();
    res.status(201).json(distillery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
