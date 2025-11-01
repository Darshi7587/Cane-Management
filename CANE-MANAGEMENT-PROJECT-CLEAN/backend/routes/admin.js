import express from 'express';
import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import LogisticsPartner from '../models/LogisticsPartner.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get admin dashboard data (authenticated)
router.get('/dashboard', async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
    
    // Get user and verify role
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Get user counts by role
    const totalUsers = await User.countDocuments();
    const farmerCount = await User.countDocuments({ role: 'farmer' });
    const logisticsCount = await User.countDocuments({ role: 'logistics' });
    const staffCount = await User.countDocuments({ role: 'staff' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Get pending approvals (users with status 'pending')
    const pendingApprovals = await User.countDocuments({ status: 'pending' });

    // Get recent registrations (last 10 users)
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role status createdAt');

    // Get pending approval list
    const pendingApprovalsList = await User.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    // Mock active operations (you can replace with real data from production)
    const activeOperations = 45;

    // Mock system health (you can implement real health checks)
    const systemHealth = '98';

    res.json({
      adminName: user.name,
      email: user.email,
      totalUsers,
      pendingApprovals,
      activeOperations,
      systemHealth,
      recentRegistrations: recentRegistrations.map(u => ({
        id: u._id,
        name: u.name,
        role: u.role,
        email: u.email,
        registeredAt: u.createdAt,
        status: u.status
      })),
      pendingApprovalsList: pendingApprovalsList.map(u => ({
        id: u._id,
        name: u.name,
        role: u.role,
        email: u.email,
        submittedAt: u.createdAt
      })),
      userStats: {
        farmers: farmerCount,
        logistics: logisticsCount,
        staff: staffCount,
        admin: adminCount
      }
    });

  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ 
      message: 'Failed to fetch admin dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Approve user
router.post('/approve-user/:userId', async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
    
    // Get user and verify role
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Find user to approve
    const userToApprove = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'active', isEmailVerified: true },
      { new: true }
    );

    if (!userToApprove) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'User approved successfully',
      user: {
        id: userToApprove._id,
        name: userToApprove.name,
        email: userToApprove.email,
        role: userToApprove.role,
        status: userToApprove.status
      }
    });

  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ 
      message: 'Failed to approve user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
