import mongoose from 'mongoose';

const distillerySchema = new mongoose.Schema({
  production: {
    ethanol: { type: Number, required: true }, // liters per day
    molasses: { type: Number, required: true } // tons
  },
  storage: {
    ethanolTank: { 
      current: { type: Number, required: true },
      capacity: { type: Number, required: true }
    },
    molassesTank: {
      current: { type: Number, required: true },
      capacity: { type: Number, required: true }
    }
  },
  efficiency: { type: Number, required: true }, // percentage
  qualityGrade: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Distillery', distillerySchema);
