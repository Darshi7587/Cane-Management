import express from 'express';
import Production from '../models/Production.js';

const router = express.Router();

// Get current production KPIs
router.get('/kpis', async (req, res) => {
  try {
    const latest = await Production.findOne().sort({ timestamp: -1 });
    if (!latest) {
      return res.status(404).json({ message: 'No production data found' });
    }
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get production history
router.get('/history', async (req, res) => {
  try {
    const { limit = 24 } = req.query;
    const history = await Production.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create production entry
router.post('/', async (req, res) => {
  try {
    const production = new Production(req.body);
    await production.save();
    res.status(201).json(production);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update production entry
router.put('/:id', async (req, res) => {
  try {
    const production = await Production.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!production) {
      return res.status(404).json({ message: 'Production entry not found' });
    }
    res.json(production);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
