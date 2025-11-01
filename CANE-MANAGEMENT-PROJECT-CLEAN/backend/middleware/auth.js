import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password -refreshToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status}. Please contact administrator.`
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts.'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.message === 'Invalid or expired access token') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh your session.',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Role-Based Access Control Middleware
 * Restricts access based on user role
 * @param {Array<String>} allowedRoles - Array of roles that can access the route
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource requires ${allowedRoles.join(' or ')} role.`,
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Department-Based Access Control (for staff)
 * @param {Array<String>} allowedDepartments - Array of departments that can access
 */
export const authorizeDepartment = (...allowedDepartments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'This resource is only accessible to staff members.'
      });
    }

    if (!allowedDepartments.includes(req.user.department)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource requires ${allowedDepartments.join(' or ')} department.`,
        requiredDepartments: allowedDepartments,
        userDepartment: req.user.department
      });
    }

    next();
  };
};

/**
 * Admin or Owner Access
 * Allows admins or the resource owner to access
 * @param {String} resourceUserField - Field name in request that contains the owner's user ID
 */
export const authorizeAdminOrOwner = (resourceUserField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const resourceUserId = req.params[resourceUserField] || req.body[resourceUserField];
    const isOwner = resourceUserId && resourceUserId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources or you must be an admin.'
      });
    }

    next();
  };
};

/**
 * Optional Authentication
 * Attaches user if token is valid, but doesn't require authentication
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password -refreshToken');

    if (user && user.status === 'active' && !user.isLocked) {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

/**
 * Check Email Verification
 * Requires user to have verified email
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please check your email.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

/**
 * Rate Limiting by Role
 * Different rate limits for different user roles
 */
export const roleBasedRateLimit = (limits) => {
  const rateLimitMap = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userKey = `${req.user._id}-${req.path}`;
    const limit = limits[req.user.role] || limits.default || 100;
    const windowMs = 60 * 1000; // 1 minute window

    if (!rateLimitMap.has(userKey)) {
      rateLimitMap.set(userKey, {
        count: 1,
        resetTime: Date.now() + windowMs
      });
      return next();
    }

    const rateLimit = rateLimitMap.get(userKey);

    if (Date.now() > rateLimit.resetTime) {
      rateLimitMap.set(userKey, {
        count: 1,
        resetTime: Date.now() + windowMs
      });
      return next();
    }

    if (rateLimit.count >= limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      });
    }

    rateLimit.count++;
    next();
  };
};
