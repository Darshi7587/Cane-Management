import jwt from 'jsonwebtoken';

// JWT Secret Keys (In production, use environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production-2024';

// Token expiry times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      department: payload.department || null
    },
    JWT_SECRET,
    { 
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    }
  );
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email
    },
    JWT_REFRESH_SECRET,
    { 
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    }
  );
};

/**
 * Verify Access Token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify Refresh Token
 * @param {String} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object from database
 * @returns {Object} Object containing both tokens
 */
export const generateTokenPair = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    department: user.department
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

/**
 * Decode token without verification (for debugging)
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
