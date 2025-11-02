import express from 'express';
import Production from '../models/Production.js';
import Farmer from '../models/Farmer.js';
import Distillery from '../models/Distillery.js';
import PowerPlant from '../models/PowerPlant.js';
import Sustainability from '../models/Sustainability.js';

const router = express.Router();

// Get comprehensive analytics dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Production stats
    const productionData = await Production.find()
      .sort({ timestamp: -1 })
      .limit(6);
    
    // Financial summary
    const totalRevenue = await Farmer.aggregate([
      { $group: { _id: null, total: { $sum: '$netPayable' } } }
    ]);
    
    const paidAmount = await Farmer.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$netPayable' } } }
    ]);
    
    // Efficiency metrics
    const latestProduction = await Production.findOne().sort({ timestamp: -1 });
    const latestDistillery = await Distillery.findOne().sort({ timestamp: -1 });
    const latestPower = await PowerPlant.findOne().sort({ timestamp: -1 });
    
    const overallEfficiency = latestProduction && latestDistillery && latestPower
      ? ((latestProduction.sugarRecoveryFactor.value / 12) * 0.4 +
         (latestDistillery.efficiency / 100) * 0.3 +
         (latestPower.efficiency / 100) * 0.3) * 100
      : 0;
    
    res.json({
      production: {
        monthly: productionData.map(p => ({
          month: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short' }),
          production: p.crushingRate.value,
          target: p.crushingRate.target
        }))
      },
      financial: {
        totalRevenue: totalRevenue[0]?.total || 0,
        paidAmount: paidAmount[0]?.total || 0,
        pendingAmount: (totalRevenue[0]?.total || 0) - (paidAmount[0]?.total || 0)
      },
      efficiency: {
        overall: Math.round(overallEfficiency * 10) / 10,
        production: latestProduction?.sugarRecoveryFactor.value || 0,
        distillery: latestDistillery?.efficiency || 0,
        power: latestPower?.efficiency || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get department-wise performance
router.get('/departments', async (req, res) => {
  try {
    const production = await Production.findOne().sort({ timestamp: -1 });
    const distillery = await Distillery.findOne().sort({ timestamp: -1 });
    const power = await PowerPlant.findOne().sort({ timestamp: -1 });
    
    res.json([
      { name: 'Production', value: production?.sugarRecoveryFactor.value * 8 || 85 },
      { name: 'Distillery', value: distillery?.efficiency || 90 },
      { name: 'Power Plant', value: power?.efficiency || 88 },
      { name: 'Logistics', value: 85 }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
