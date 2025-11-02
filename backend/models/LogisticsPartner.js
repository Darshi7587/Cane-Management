import mongoose from 'mongoose';

const logisticsPartnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  
  // Company Details
  gstNumber: String,
  panNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    pinCode: String
  },
  
  // Fleet Details
  fleetSize: { type: Number, default: 0 },
  vehicleTypes: [String],
  
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'],
    default: 'active' 
  },
  activeDeliveries: { type: Number, default: 0 },
  completedDeliveries: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  
  // Verification
  isVerified: { type: Boolean, default: false },
  verificationDate: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('LogisticsPartner', logisticsPartnerSchema);
