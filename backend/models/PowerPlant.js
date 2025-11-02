import mongoose from 'mongoose';

const powerPlantSchema = new mongoose.Schema({
  generation: {
    current: { type: Number, required: true }, // MW
    capacity: { type: Number, required: true }, // MW
    gridExport: { type: Number, required: true } // MW
  },
  baggasseUsed: { type: Number, required: true }, // tons per hour
  efficiency: { type: Number, required: true }, // percentage
  boilerPressure: { type: Number, required: true }, // kg/cm²
  steamTemperature: { type: Number, required: true }, // °C
  status: { 
    type: String, 
    enum: ['Operational', 'Maintenance', 'Offline'], 
    default: 'Operational' 
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('PowerPlant', powerPlantSchema);
