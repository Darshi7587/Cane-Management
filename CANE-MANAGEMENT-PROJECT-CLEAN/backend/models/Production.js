import mongoose from 'mongoose';

const productionSchema = new mongoose.Schema({
  crushingRate: {
    value: { type: Number, required: true },
    unit: { type: String, default: 'TCH' },
    target: { type: Number, required: true }
  },
  sugarRecoveryFactor: {
    value: { type: Number, required: true },
    unit: { type: String, default: '%' },
    trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' }
  },
  downtimeSummary: {
    totalHours: { type: Number, default: 0 },
    mechanical: { type: Number, default: 0 },
    process: { type: Number, default: 0 },
    electrical: { type: Number, default: 0 }
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Production', productionSchema);
