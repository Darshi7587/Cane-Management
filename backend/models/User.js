import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  // Basic Information
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    index: true
  },
  password: { 
    type: String, 
    required: true,
    select: false // Don't include password in queries by default
  },
  
  // User Role & Status
  role: { 
    type: String, 
    enum: ['farmer', 'logistics', 'admin', 'staff'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  
  // Profile Information
  name: { type: String, required: true },
  mobileNumber: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  profilePhoto: { type: String },
  
  // Department (for staff only)
  department: {
    type: String,
    enum: ['production', 'quality', 'hr', 'support', null],
    default: null
  },
  
  // Email Verification
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpiry: { type: Date },
  
  // Password Reset
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  
  // Refresh Token
  refreshToken: { type: String },
  
  // Two-Factor Authentication
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false },
  
  // Admin Approval
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvalDate: { type: Date },
  rejectionReason: { type: String },
  
  // Reference to role-specific data
  farmerProfile: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer' 
  },
  logisticsProfile: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Logistics' 
  },
  
  // Session & Activity
  lastLogin: { type: Date },
  lastLoginIp: { type: String },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.twoFactorSecret;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
userSchema.index({ email: 1, role: 1 });
userSchema.index({ status: 1, role: 1 });
userSchema.index({ createdAt: -1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const user = await mongoose.model('User').findById(this._id).select('+password');
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    throw error;
  }
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

// Check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // Lock account after 5 failed attempts for 2 hours
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return await this.updateOne(updates);
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$role',
        total: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats;
};

const User = mongoose.model('User', userSchema);

export default User;
