import mongoose from 'mongoose';

const sustainabilitySchema = new mongoose.Schema({
  waterUsage: {
    daily: { type: Number, required: true }, // m³
    recycled: { type: Number, required: true }, // m³
    efficiency: { type: Number, required: true } // percentage
  },
  emissions: {
    co2: { type: Number, required: true }, // tons
    reduction: { type: Number, required: true } // percentage vs baseline
  },
  wasteManagement: {
    totalWaste: { type: Number, required: true }, // tons
    recycled: { type: Number, required: true }, // tons
    recyclingRate: { type: Number, required: true } // percentage
  },
  energyMix: {
    renewable: { type: Number, required: true }, // percentage
    grid: { type: Number, required: true } // percentage
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Sustainability', sustainabilitySchema);
