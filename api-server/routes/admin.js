// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { 
  Admin, 
  User, 
  CampingProduct, 
  Order, 
  Category,
  sequelize 
} = require('../models');
const { authenticateAdmin, requireSuperAdmin } = require('./middleware/auth');

// Admin login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email,
        isSuperadmin: admin.isSuperadmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          fullName: admin.fullName,
          isSuperadmin: admin.isSuperadmin
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Get statistics
    const [
      totalUsers,
      newUsersToday,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      monthlyRevenue,
      topProducts,
      recentOrders,
      categoryStats
    ] = await Promise.all([
      // Total users
      User.count(),
      
      // New users today
      User.count({
        where: {
          createdAt: { [Op.gte]: today }
        }
      }),
      
      // Total products
      CampingProduct.count(),
      
      // Active products
      CampingProduct.count({
        where: { isActive: true }
      }),
      
      // Total orders
      Order.count(),
      
      // Pending orders
      Order.count({
        where: { status: 'pending' }
      }),
      
      // Total revenue
      Order.sum('total', {
        where: { paymentStatus: 'completed' }
      }),
      
      // This month's revenue
      Order.sum('total', {
        where: {
          paymentStatus: 'completed',
          createdAt: { [Op.gte]: thisMonth }
        }
      }),
      
      // Top selling products
      CampingProduct.findAll({
        attributes: [
          'id', 'name', 'mainImage', 'salePrice',
          [sequelize.literal('soldCount + rentCount'), 'totalSales']
        ],
        order: [[sequelize.literal('totalSales'), 'DESC']],
        limit: 5
      }),
      
      // Recent orders
      Order.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['fullName', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: 10
      }),
      
      // Category statistics
      Category.findAll({
        include: [{
          model: CampingProduct,
          as: 'products',
          attributes: [],
          where: { isActive: true },
          required: false
        }],
        attributes: [
          'id', 'name',
          [sequelize.fn('COUNT', sequelize.col('products.id')), 'productCount']
        ],
        group: ['Category.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('products.id')), 'DESC']]
      })
    ]);

    // Calculate growth rates
    const lastMonthRevenue = await Order.sum('total', {
      where: {
        paymentStatus: 'completed',
        createdAt: {
          [Op.gte]: lastMonth,
          [Op.lt]: thisMonth
        }
      }
    });

    const revenueGrowth = lastMonthRevenue ? 
      ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;

    // Sales chart data (last 7 days)
    const salesData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dailyRevenue = await Order.sum('total', {
        where: {
          paymentStatus: 'completed',
          createdAt: {
            [Op.gte]: date,
            [Op.lt]: nextDate
          }
        }
      }) || 0;
      
      salesData.push({
        date: date.toISOString().split('T')[0],
        revenue: dailyRevenue
      });
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          newUsersToday,
          totalProducts,
          activeProducts,
          totalOrders,
          pendingOrders,
          totalRevenue: totalRevenue || 0,
          monthlyRevenue: monthlyRevenue || 0,
          revenueGrowth
        },
        topProducts,
        recentOrders,
        categoryStats,
        salesData
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

// Admin management (super admin only)
// Get all admins
router.get('/admins', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { admins }
    });

  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins'
    });
  }
});

// Create admin
router.post('/admins', 
  authenticateAdmin, 
  requireSuperAdmin,
  [
    body('email').isEmail().normalizeEmail(),
    body('username').notEmpty().trim(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email, username, password, fullName, isSuperadmin = false } = req.body;

      // Check if admin exists
      const existing = await Admin.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email or username already exists'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create admin
      const admin = await Admin.create({
        email,
        username,
        passwordHash,
        fullName,
        isSuperadmin
      });

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: {
          admin: {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            fullName: admin.fullName,
            isSuperadmin: admin.isSuperadmin
          }
        }
      });

    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create admin'
      });
    }
});

// Update admin
router.put('/admins/:id',
  authenticateAdmin,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      const admin = await Admin.findByPk(id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Hash password if provided
      if (updateData.password) {
        updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
        delete updateData.password;
      }

      await admin.update(updateData);

      res.json({
        success: true,
        message: 'Admin updated successfully',
        data: {
          admin: {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            fullName: admin.fullName,
            isSuperadmin: admin.isSuperadmin,
            isActive: admin.isActive
          }
        }
      });

    } catch (error) {
      console.error('Update admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update admin'
      });
    }
});

// Toggle admin status
router.patch('/admins/:id/toggle-status',
  authenticateAdmin,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (id == req.admin.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own account'
        });
      }

      const admin = await Admin.findByPk(id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      await admin.update({ isActive: !admin.isActive });

      res.json({
        success: true,
        message: `Admin ${admin.isActive ? 'activated' : 'deactivated'}`,
        data: { isActive: admin.isActive }
      });

    } catch (error) {
      console.error('Toggle admin status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle admin status'
      });
    }
});

// Get admin profile
router.get('/profile', authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['passwordHash'] }
    });

    res.json({
      success: true,
      data: { admin }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update admin profile
router.put('/profile',
  authenticateAdmin,
  [
    body('fullName').optional().trim(),
    body('currentPassword').optional(),
    body('newPassword').optional().isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const { fullName, currentPassword, newPassword, avatarUrl } = req.body;

      const admin = await Admin.findByPk(req.admin.id);

      const updateData = {};
      if (fullName) updateData.fullName = fullName;
      if (avatarUrl) updateData.avatarUrl = avatarUrl;

      // Change password if requested
      if (currentPassword && newPassword) {
        const isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
        updateData.passwordHash = await bcrypt.hash(newPassword, 10);
      }

      await admin.update(updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          admin: {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            fullName: admin.fullName,
            avatarUrl: admin.avatarUrl
          }
        }
      });

    } catch (error) {
      console.error('Update admin profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
});

module.exports = router;