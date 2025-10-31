import mongoose from 'mongoose';
import crypto from 'crypto';

const farmerSchema = new mongoose.Schema({
  // Personal Information
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  mobileNumber: { type: String, unique: true, required: true },
  
  // Digital Farmer ID - Auto-generated format: FARM-YYYY-XXXX
  digitalFarmerId: { 
    type: String, 
    unique: true, 
    sparse: true,
    index: true 
  },
  
  // Agricultural Details
  areaInAcres: { type: Number },
  landLocation: { type: String },
  cropHistory: [{
    crop: String,
    year: Number,
    quantity: Number,
    unit: String
  }],
  
  // Financial Information
  tonnage: { type: Number },
  qualityDeduction: { type: Number, default: 0 },
  netPayable: { type: Number },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Paid', 'Pending', 'Processing'], 
    default: 'Active' 
  },
  paymentDate: { type: Date },
  lastDeliveryDate: { type: Date, default: Date.now },
  
  // Blockchain Integration Fields
  blockchainWalletAddress: { type: String },
  blockchainTransactionHash: { type: String, sparse: true },
  farmerDetailsHash: { 
    type: String, 
    description: 'SHA-256 hash of farmer details for tamper-proof verification'
  },
  blockchainVerified: { type: Boolean, default: false },
  blockchainVerificationTimestamp: { type: Date },
  
  // Registration Verification
  isRegistered: { type: Boolean, default: false },
  registrationVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  
  // Metadata
  registrationDate: { type: Date, default: Date.now },
  registrationIpAddress: { type: String }
}, { 
  timestamps: true,
  indexes: [
    { mobileNumber: 1 },
    { email: 1 },
    { digitalFarmerId: 1 },
    { blockchainWalletAddress: 1 }
  ]
});

/**
 * Pre-save middleware to generate Digital Farmer ID and farmer details hash
 * Format: FARM-YYYY-XXXX where XXXX is a random 4-digit number
 */
farmerSchema.pre('save', async function(next) {
  try {
    // Generate digital farmer ID if not already set
    if (!this.digitalFarmerId && this.isRegistered) {
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.digitalFarmerId = `FARM-${year}-${randomSuffix}`;
    }
    
    // Generate hash of farmer details for blockchain verification
    if (this.isRegistered && !this.farmerDetailsHash) {
      const farmerData = {
        name: this.name,
        mobileNumber: this.mobileNumber,
        email: this.email,
        areaInAcres: this.areaInAcres,
        landLocation: this.landLocation,
        registrationDate: this.registrationDate
      };
      this.farmerDetailsHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(farmerData))
        .digest('hex');
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to verify farmer details against stored hash
 * Used to validate that farmer data hasn't been tampered with
 */
farmerSchema.methods.verifyDetailsHash = function() {
  const farmerData = {
    name: this.name,
    mobileNumber: this.mobileNumber,
    email: this.email,
    areaInAcres: this.areaInAcres,
    landLocation: this.landLocation,
    registrationDate: this.registrationDate
  };
  const calculatedHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(farmerData))
    .digest('hex');
  
  return calculatedHash === this.farmerDetailsHash;
};

/**
 * Method to get farmer details as blockchain record
 */
farmerSchema.methods.getBlockchainRecord = function() {
  return {
    farmerId: this.digitalFarmerId,
    registrationTimestamp: this.registrationDate.getTime(),
    detailsHash: this.farmerDetailsHash,
    walletAddress: this.blockchainWalletAddress || null,
    verified: this.blockchainVerified
  };
};

export default mongoose.model('Farmer', farmerSchema);
