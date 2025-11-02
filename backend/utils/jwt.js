import jwt from 'jsonwebtoken';

// Helper functions to get secrets at runtime (after dotenv is loaded)
const getJwtSecret = () => process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-2024';
const getJwtRefreshSecret = () => process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production-2024';

// Token expiry times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT access token
 */
export const generateAccessToken = (payload) => {
  const secret = getJwtSecret();
  console.log('🔐 generateAccessToken - Using JWT_SECRET:', secret);
  console.log('📝 generateAccessToken - Payload:', payload);
  
  const token = jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      department: payload.department || null
    },
    secret,
    { 
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    }
  );
  
  console.log('✅ generateAccessToken - Token created:', token.substring(0, 50) + '...');
  return token;
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
    getJwtRefreshSecret(),
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
    return jwt.verify(token, getJwtSecret(), {
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
    return jwt.verify(token, getJwtRefreshSecret(), {
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
