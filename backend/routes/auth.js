import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.js';
import { authenticate, authorize } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * POST /api/auth/register
 * Register new user (Farmer or Logistics)
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    body('mobileNumber')
      .matches(/^[0-9]{10}$/)
      .withMessage('Valid 10-digit mobile number required'),
    body('role')
      .isIn(['farmer', 'logistics'])
      .withMessage('Role must be farmer or logistics')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, password, mobileNumber, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { mobileNumber }]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.email === email
            ? 'Email already registered'
            : 'Mobile number already registered'
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        mobileNumber,
        role,
        status: 'pending', // Requires admin approval
        lastLoginIp: req.ip
      });

      // Generate email verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // TODO: Send verification email
      console.log(`📧 Email verification token for ${email}: ${verificationToken}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email and wait for admin approval.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Login user with email/password
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').optional().isIn(['farmer', 'logistics', 'admin', 'staff']).withMessage('Invalid role'),
    body('department').optional().isString().withMessage('Invalid department')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, role, department } = req.body;

      console.log('🔐 Login attempt:', { email, role, department });

      // Find user with password field
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log('✅ User found:', { 
        email: user.email, 
        role: user.role, 
        status: user.status,
        hasPassword: !!user.password 
      });

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
        });
      }

      // Verify role if provided
      if (role && user.role !== role) {
        return res.status(401).json({
          success: false,
          message: `Invalid credentials for ${role} login. Please use the correct login page.`,
          code: 'ROLE_MISMATCH'
        });
      }

      // Verify department for staff if provided
      if (department && user.role === 'staff' && user.department !== department) {
        return res.status(401).json({
          success: false,
          message: 'Department mismatch. Please select your assigned department.',
          code: 'DEPARTMENT_MISMATCH'
        });
      }

      // Verify password
      console.log('🔑 Comparing password...');
      const isPasswordValid = await user.comparePassword(password);
      console.log('🔑 Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        await user.incrementLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          attemptsRemaining: 5 - (user.loginAttempts + 1)
        });
      }

      // Check account status
      if (user.status === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your account is pending admin approval.',
          code: 'PENDING_APPROVAL'
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended. Please contact administrator.',
          code: 'ACCOUNT_SUSPENDED'
        });
      }

      if (user.status === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your registration was rejected.',
          code: 'ACCOUNT_REJECTED'
        });
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();

      // Generate tokens
      console.log('🎫 Generating tokens for user:', user._id);
      const { accessToken, refreshToken } = generateTokenPair(user);
      console.log('✅ Access token generated:', accessToken.substring(0, 50) + '...');

      // Save refresh token
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      user.lastLoginIp = req.ip;
      await user.save();

      // Get role-specific profile data
      let profileData = null;
      if (user.role === 'farmer' && user.farmerProfile) {
        profileData = await Farmer.findById(user.farmerProfile);
      }

      res.json({
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          profilePhoto: user.profilePhoto,
          profileData
        }
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user with matching refresh token
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken: refreshToken
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check user status
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Generate new tokens
    const tokens = generateTokenPair(user);

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      tokens
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token refresh failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (invalidate refresh token)
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Clear refresh token
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 }
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/auth/verify-email/:token
 * Verify user email
 */
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully. Your account is pending admin approval.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;

    // Get role-specific profile
    let profileData = null;
    if (user.role === 'farmer' && user.farmerProfile) {
      profileData = await Farmer.findById(user.farmerProfile);
    }

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        profileData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/auth/pending-approvals
 * Get list of users pending approval (Admin only)
 */
router.get(
  '/pending-approvals',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { role } = req.query;

      const query = { status: 'pending' };
      if (role) {
        query.role = role;
      }

      const pendingUsers = await User.find(query)
        .select('-password -refreshToken')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: pendingUsers.length,
        users: pendingUsers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending approvals',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * POST /api/auth/approve/:userId
 * Approve user registration (Admin only)
 */
router.post(
  '/approve/:userId',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `User is already ${user.status}`
        });
      }

      user.status = 'active';
      user.approvedBy = req.user._id;
      user.approvalDate = new Date();
      await user.save();

      // TODO: Send approval email

      res.json({
        success: true,
        message: 'User approved successfully',
        user: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Approval failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * POST /api/auth/reject/:userId
 * Reject user registration (Admin only)
 */
router.post(
  '/reject/:userId',
  authenticate,
  authorize('admin'),
  [
    body('reason').trim().notEmpty().withMessage('Rejection reason is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { reason } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      user.status = 'rejected';
      user.rejectionReason = reason;
      await user.save();

      // TODO: Send rejection email

      res.json({
        success: true,
        message: 'User rejected successfully',
        user: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Rejection failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

export default router;
