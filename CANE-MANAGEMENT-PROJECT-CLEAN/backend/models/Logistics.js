import mongoose from 'mongoose';

const logisticsSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  driverName: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  load: { type: Number, required: true }, // in tons
  status: { 
    type: String, 
    enum: ['In Transit', 'Delivered', 'Loading', 'Waiting'], 
    default: 'Waiting' 
  },
  eta: { type: Date },
  departureTime: { type: Date },
  arrivalTime: { type: Date },
  gpsCoordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model('Logistics', logisticsSchema);
