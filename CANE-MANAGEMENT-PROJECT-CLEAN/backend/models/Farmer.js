import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  farmerId: { type: String, unique: true, required: true },
  contactNumber: { type: String },
  areaInAcres: { type: Number },
  tonnage: { type: Number, required: true },
  qualityDeduction: { type: Number, default: 0 },
  netPayable: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Processing'], 
    default: 'Pending' 
  },
  paymentDate: { type: Date },
  lastDeliveryDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Farmer', farmerSchema);
