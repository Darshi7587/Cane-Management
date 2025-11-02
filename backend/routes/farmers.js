import express from 'express';
import Farmer from '../models/Farmer.js';
import { body, validationResult, param } from 'express-validator';
import crypto from 'crypto';
import * as blockchainService from '../services/blockchainService.js';

const router = express.Router();

// ============ Middleware ============

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// ============ Farmer Registration Endpoints ============

/**
 * POST /register-farmer
 * Register a new farmer with blockchain integration
 * 
 * Request Body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "mobileNumber": "+919876543210",
 *   "areaInAcres": 5.5,
 *   "landLocation": "Village Name, District, State",
 *   "cropHistory": [
 *     { "crop": "Sugarcane", "year": 2024, "quantity": 50, "unit": "tons" }
 *   ]
 * }
 */
router.post(
  '/register-farmer',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('mobileNumber')
      .trim()
      .notEmpty()
      .withMessage('Mobile number is required')
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
      .withMessage('Invalid mobile number format'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format'),
    body('areaInAcres')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Area must be a positive number'),
    body('landLocation')
      .optional()
      .trim(),
    body('cropHistory')
      .optional()
      .isArray()
      .withMessage('Crop history must be an array'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        email,
        mobileNumber,
        areaInAcres,
        landLocation,
        cropHistory = []
      } = req.body;

      // Check if farmer already exists
      const existingFarmer = await Farmer.findOne({
        $or: [{ mobileNumber }, { email }]
      });

      if (existingFarmer) {
        return res.status(400).json({
          success: false,
          message: 'Farmer with this mobile number or email already registered'
        });
      }

      // Create new farmer document
      const farmer = new Farmer({
        name,
        email,
        mobileNumber,
        areaInAcres: areaInAcres || 0,
        landLocation,
        cropHistory,
        isRegistered: true,
        registrationIpAddress: req.ip
      });

      // Generate digital farmer ID and hash on save
      await farmer.save();

      // Generate wallet for farmer
      let blockchainWallet = null;
      let blockchainTx = null;

      try {
        // Generate wallet
        blockchainWallet = blockchainService.generateFarmerWallet();
        farmer.blockchainWalletAddress = blockchainWallet.address;

        // Prepare blockchain data
        const blockchainData = {
          farmerId: farmer.digitalFarmerId,
          detailsHash: farmer.farmerDetailsHash,
          timestamp: Math.floor(farmer.registrationDate.getTime() / 1000),
          walletAddress: blockchainWallet.address
        };

        // Register on blockchain
        blockchainTx = await blockchainService.registerFarmerOnBlockchain(blockchainData);
        
        // Update farmer with blockchain data
        farmer.blockchainTransactionHash = blockchainTx.transactionHash;
        farmer.blockchainVerified = true;
        farmer.blockchainVerificationTimestamp = new Date();
        farmer.registrationVerified = true;

        await farmer.save();

        console.log(`✅ Farmer ${farmer.digitalFarmerId} registered successfully on blockchain`);
      } catch (blockchainError) {
        console.warn('⚠️ Blockchain registration failed, but farmer saved to DB:', blockchainError.message);
        // Continue even if blockchain fails - farmer is still registered in database
      }

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Farmer registered successfully',
        farmer: {
          _id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          mobileNumber: farmer.mobileNumber,
          digitalFarmerId: farmer.digitalFarmerId,
          areaInAcres: farmer.areaInAcres,
          landLocation: farmer.landLocation,
          blockchainWalletAddress: farmer.blockchainWalletAddress,
          blockchainTransactionHash: farmer.blockchainTransactionHash,
          blockchainVerified: farmer.blockchainVerified,
          registrationDate: farmer.registrationDate,
        },
        blockchain: blockchainTx ? {
          registered: true,
          transactionHash: blockchainTx.transactionHash,
          blockNumber: blockchainTx.blockNumber
        } : {
          registered: false,
          message: 'Blockchain registration pending'
        }
      });

    } catch (error) {
      console.error('❌ Registration error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * GET /profile
 * Get logged-in farmer's profile
 * Requires authentication
 */
router.get('/profile', async (req, res) => {
  try {
    console.log('\n🔍 === FARMERS PROFILE REQUEST ===');
    console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 20) + '...');
    
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    console.log('🎫 Token received:', token ? token.substring(0, 50) + '...' : 'No token');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Decode token to get user ID
    const jwt = await import('jsonwebtoken');
    let decoded;
    try {
      console.log('🔍 Attempting to verify token...');
      console.log('🔑 Using JWT_SECRET:', process.env.JWT_SECRET);
      console.log('🏢 Expecting issuer: ssimp-cane-management');
      console.log('👥 Expecting audience: ssimp-users');
      
      // First decode WITHOUT verification to see what's inside
      const unverified = jwt.default.decode(token, { complete: true });
      console.log('📦 Token header:', unverified?.header);
      console.log('📦 Token payload:', unverified?.payload);
      
      decoded = jwt.default.verify(token, process.env.JWT_SECRET, {
        issuer: 'ssimp-cane-management',
        audience: 'ssimp-users'
      });
      console.log('✅ Token decoded:', decoded);
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      console.error('❌ Full error:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Find user by ID
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.error('❌ User not found:', decoded.userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User found:', user.email, 'Role:', user.role);
    
    if (user.role !== 'farmer') {
      console.error('❌ Wrong role:', user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Farmer role required.'
      });
    }

    // Find farmer profile
    const farmer = await Farmer.findOne({ email: user.email });
    
    if (!farmer) {
      console.error('❌ Farmer profile not found for email:', user.email);
      // Return user data even if farmer profile doesn't exist
      return res.json({
        name: user.name,
        email: user.email,
        digitalFarmerId: 'FARM-2024-PENDING',
        totalLand: 0,
        seasonYield: 0,
        pendingPayment: 0,
        recentActivities: [],
        upcomingPickups: []
      });
    }

    console.log('✅ Farmer profile found:', farmer.digitalFarmerId);

    // Return farmer data
    res.json({
      name: farmer.name || user.name,
      email: farmer.email || user.email,
      digitalFarmerId: farmer.digitalFarmerId || 'FARM-2024-0001',
      totalLand: farmer.areaInAcres || 0,
      seasonYield: 125, // Mock data - replace with actual from Production model
      pendingPayment: farmer.netPayable || 0,
      recentActivities: [
        {
          type: 'yield',
          description: 'Yield submission approved - 25 tons',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'payment',
          description: 'Payment processed - ₹75,000',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'pickup',
          description: 'Pickup scheduled for tomorrow',
          time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        }
      ],
      upcomingPickups: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00 AM',
          vehicle: 'MH-12-AB-1234',
          status: 'scheduled'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          time: '2:00 PM',
          vehicle: 'MH-12-CD-5678',
          status: 'pending'
        }
      ]
    });
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /get-farmer/:id
 * Get farmer details by ID (MongoDB _id or Digital Farmer ID)
 */
router.get(
  '/get-farmer/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('Farmer ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      let farmer = null;

      // Try to find by MongoDB _id first
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        farmer = await Farmer.findById(id);
      }

      // If not found, try digital farmer ID
      if (!farmer) {
        farmer = await Farmer.findOne({ digitalFarmerId: id });
      }

      // If still not found, try mobile number or email
      if (!farmer) {
        farmer = await Farmer.findOne({
          $or: [{ mobileNumber: id }, { email: id }]
        });
      }

      if (!farmer) {
        return res.status(404).json({
          success: false,
          message: 'Farmer not found'
        });
      }

      // Verify blockchain if available
      let blockchainVerification = null;
      if (farmer.blockchainTransactionHash) {
        try {
          blockchainVerification = await blockchainService.verifyFarmerOnBlockchain(
            farmer.digitalFarmerId
          );
        } catch (error) {
          console.warn('⚠️ Blockchain verification unavailable:', error.message);
        }
      }

      res.json({
        success: true,
        farmer: {
          _id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          mobileNumber: farmer.mobileNumber,
          digitalFarmerId: farmer.digitalFarmerId,
          areaInAcres: farmer.areaInAcres,
          landLocation: farmer.landLocation,
          cropHistory: farmer.cropHistory,
          tonnage: farmer.tonnage,
          status: farmer.status,
          blockchainWalletAddress: farmer.blockchainWalletAddress,
          blockchainTransactionHash: farmer.blockchainTransactionHash,
          blockchainVerified: farmer.blockchainVerified,
          registrationVerified: farmer.registrationVerified,
          registrationDate: farmer.registrationDate,
          lastDeliveryDate: farmer.lastDeliveryDate,
        },
        blockchainVerification
      });

    } catch (error) {
      console.error('❌ Fetch farmer error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch farmer details',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// ============ Existing Endpoints (Legacy) ============

// Get all farmers
router.get('/', async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;
    const query = status ? { status } : {};
    const farmers = await Farmer.find(query)
      .sort({ lastDeliveryDate: -1 })
      .limit(parseInt(limit));
    res.json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get farmer by MongoDB ID (legacy)
router.get('/id/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ 
        success: false,
        message: 'Farmer not found' 
      });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Create farmer (legacy)
router.post('/', async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.status(201).json({ success: true, farmer });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Update farmer payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { status } = req.body;
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        paymentDate: status === 'Paid' ? new Date() : undefined 
      },
      { new: true }
    );
    if (!farmer) {
      return res.status(404).json({ 
        success: false,
        message: 'Farmer not found' 
      });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get payment summary
router.get('/summary/payments', async (req, res) => {
  try {
    const totalPaid = await Farmer.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$netPayable' } } }
    ]);
    const totalPending = await Farmer.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$netPayable' } } }
    ]);
    res.json({
      success: true,
      paid: totalPaid[0]?.total || 0,
      pending: totalPending[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;
