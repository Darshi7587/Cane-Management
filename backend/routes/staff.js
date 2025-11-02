import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Production Dashboard
router.get('/production/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'staff' || user.department !== 'production') {
      return res.status(403).json({ message: 'Access denied. Production department access required.' });
    }

    // Mock production data (replace with real production model queries)
    const productionData = {
      staffName: user.name,
      email: user.email,
      department: user.department,
      activeBatches: 8,
      completedToday: 3,
      qualityPassRate: 95,
      batches: [
        {
          id: '1',
          batchNumber: 'BATCH-2024-001',
          stage: 'Crushing',
          progress: 45,
          startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          batchNumber: 'BATCH-2024-002',
          stage: 'Boiling',
          progress: 70,
          startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          batchNumber: 'BATCH-2024-003',
          stage: 'Crystallization',
          progress: 25,
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ],
      equipment: [
        {
          id: '1',
          name: 'Crusher Unit 1',
          type: 'Crusher',
          status: 'operational',
          lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Boiler Unit 1',
          type: 'Boiler',
          status: 'operational',
          lastMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Crusher Unit 2',
          type: 'Crusher',
          status: 'maintenance',
          lastMaintenance: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json(productionData);

  } catch (error) {
    console.error('Error fetching production dashboard:', error);
    res.status(500).json({ 
      message: 'Failed to fetch production dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Quality Dashboard
router.get('/quality/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'staff' || user.department !== 'quality') {
      return res.status(403).json({ message: 'Access denied. Quality department access required.' });
    }

    const qualityData = {
      staffName: user.name,
      email: user.email,
      department: user.department,
      testsCompleted: 45,
      testsPending: 8,
      complianceRate: 98,
      recentTests: [
        {
          id: '1',
          testId: 'QT-2024-001',
          batchNumber: 'BATCH-2024-001',
          testType: 'Sucrose Content',
          result: 'passed',
          testedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          testId: 'QT-2024-002',
          batchNumber: 'BATCH-2024-002',
          testType: 'Moisture Test',
          result: 'passed',
          testedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          testId: 'QT-2024-003',
          batchNumber: 'BATCH-2024-003',
          testType: 'Color Grading',
          result: 'failed',
          testedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ],
      pendingTests: [
        {
          id: '1',
          batchNumber: 'BATCH-2024-004',
          testType: 'Sucrose Content',
          priority: 'high',
          requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          batchNumber: 'BATCH-2024-005',
          testType: 'Moisture Test',
          priority: 'medium',
          requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json(qualityData);

  } catch (error) {
    console.error('Error fetching quality dashboard:', error);
    res.status(500).json({ 
      message: 'Failed to fetch quality dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// HR Dashboard
router.get('/hr/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'staff' || user.department !== 'hr') {
      return res.status(403).json({ message: 'Access denied. HR department access required.' });
    }

    // Get total staff count
    const totalEmployees = await User.countDocuments({ role: 'staff' });

    const hrData = {
      staffName: user.name,
      email: user.email,
      department: user.department,
      totalEmployees: totalEmployees || 150,
      presentToday: 142,
      pendingPayroll: 12,
      recentActivities: [
        {
          id: '1',
          type: 'new-hire',
          employeeName: 'John Doe',
          description: 'New employee joined - Production Department',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'leave',
          employeeName: 'Jane Smith',
          description: 'Leave approved - 3 days',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'payroll',
          employeeName: 'Mike Johnson',
          description: 'Payroll processed for October',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      upcomingEvents: [
        {
          id: '1',
          eventName: 'Annual Review Meeting',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'meeting'
        },
        {
          id: '2',
          eventName: 'Team Building Activity',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'event'
        }
      ]
    };

    res.json(hrData);

  } catch (error) {
    console.error('Error fetching HR dashboard:', error);
    res.status(500).json({ 
      message: 'Failed to fetch HR dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Support Dashboard
router.get('/support/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ssimp-cane-management',
      audience: 'ssimp-users'
    });
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'staff' || user.department !== 'support') {
      return res.status(403).json({ message: 'Access denied. Support department access required.' });
    }

    const supportData = {
      staffName: user.name,
      email: user.email,
      department: user.department,
      activeTickets: 15,
      resolvedToday: 8,
      pendingMaintenance: 5,
      tickets: [
        {
          id: '1',
          ticketId: 'TICKET-001',
          subject: 'Crusher Unit 1 making unusual noise',
          priority: 'high',
          status: 'open',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          ticketId: 'TICKET-002',
          subject: 'Boiler pressure gauge not working',
          priority: 'medium',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          ticketId: 'TICKET-003',
          subject: 'Conveyor belt replacement needed',
          priority: 'low',
          status: 'open',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      maintenanceSchedule: [
        {
          id: '1',
          equipmentName: 'Crusher Unit 2',
          type: 'Preventive Maintenance',
          scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Maintenance Team A'
        },
        {
          id: '2',
          equipmentName: 'Boiler Unit 1',
          type: 'Safety Inspection',
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Maintenance Team B'
        }
      ]
    };

    res.json(supportData);

  } catch (error) {
    console.error('Error fetching support dashboard:', error);
    res.status(500).json({ 
      message: 'Failed to fetch support dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
