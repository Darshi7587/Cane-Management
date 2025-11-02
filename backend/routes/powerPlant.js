import express from 'express';
import PowerPlant from '../models/PowerPlant.js';

const router = express.Router();

// Get current power plant status
router.get('/current', async (req, res) => {
  try {
    const current = await PowerPlant.findOne().sort({ timestamp: -1 });
    if (!current) {
      return res.status(404).json({ message: 'No power plant data found' });
    }
    res.json(current);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get power generation history
router.get('/history', async (req, res) => {
  try {
    const { limit = 24 } = req.query;
    const history = await PowerPlant.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create power plant entry
router.post('/', async (req, res) => {
  try {
    const powerPlant = new PowerPlant(req.body);
    await powerPlant.save();
    res.status(201).json(powerPlant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
