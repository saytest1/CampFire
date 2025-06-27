// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Order } = require('../models');
const { authenticateToken, authenticateAdmin } = require('./middleware/auth');
const { upload } = require('../utils/upload');
const { body, validationResult } = require('express-validator');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { 
        exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] 
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get order statistics
    const orderStats = await Order.findAll({
      where: { userId: user.id },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
        [sequelize.fn('SUM', sequelize.col('total')), 'totalSpent'],
        [sequelize.literal(`COUNT(CASE WHEN status = 'delivered' THEN 1 END)`), 'completedOrders'],
        [sequelize.literal(`COUNT(CASE WHEN type = 'rental' THEN 1 END)`), 'rentalOrders']
      ],
      raw: true
    });

    res.json({
      success: true,
      data: { 
        user,
        stats: orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          completedOrders: 0,
          rentalOrders: 0
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update profile
router.put('/profile',
  authenticateToken,
  upload.single('avatar'),
  [
    body('fullName').optional().trim(),
    body('phone').optional().isMobilePhone('vi-VN'),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('district').optional().trim(),
    body('ward').optional().trim()
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

      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const updateData = { ...req.body };

      // Handle avatar upload
      if (req.file) {
        updateData.avatarUrl = `/uploads/users/${req.file.filename}`;
      }

      await user.update(updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { 
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            address: user.address,
            city: user.city,
            district: user.district,
            ward: user.ward,
            avatarUrl: user.avatarUrl
          }
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
});

// Change password
router.post('/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
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

      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
});

// Get shipping addresses
router.get('/addresses', authenticateToken, async (req, res) => {
  try {
    // Get unique addresses from orders
    const addresses = await Order.findAll({
      where: { userId: req.user.userId },
      attributes: [
        'shippingFullName',
        'shippingPhone',
        'shippingAddress',
        'shippingCity',
        'shippingDistrict',
        'shippingWard'
      ],
      group: [
        'shippingFullName',
        'shippingPhone',
        'shippingAddress',
        'shippingCity',
        'shippingDistrict',
        'shippingWard'
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: { addresses }
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses'
    });
  }
});

// Admin routes
// Get all users (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const {
      search,
      isActive,
      isVerified,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { fullName: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { 
        exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] 
      },
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get user details (admin)
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { 
        exclude: ['password', 'verificationToken', 'resetPasswordToken'] 
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const [orderStats, totalSpent] = await Promise.all([
      Order.count({
        where: { userId: id },
        group: ['status']
      }),
      Order.sum('total', {
        where: { 
          userId: id,
          paymentStatus: 'completed'
        }
      })
    ]);

    res.json({
      success: true,
      data: { 
        user,
        stats: {
          orderStats,
          totalSpent: totalSpent || 0
        }
      }
    });

  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
});

// Toggle user status (admin)
router.patch('/admin/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ isActive: !user.isActive });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      data: { isActive: user.isActive }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    });
  }
});

// Export users data (admin)
router.get('/admin/export', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id', 'email', 'fullName', 'phone', 
        'city', 'isActive', 'isVerified', 
        'createdAt', 'lastLogin'
      ],
      order: [['createdAt', 'DESC']]
    });

    // Convert to CSV format
    const csv = [
      ['ID', 'Email', 'Full Name', 'Phone', 'City', 'Active', 'Verified', 'Joined Date', 'Last Login'],
      ...users.map(user => [
        user.id,
        user.email,
        user.fullName,
        user.phone || '',
        user.city || '',
        user.isActive ? 'Yes' : 'No',
        user.isVerified ? 'Yes' : 'No',
        user.createdAt.toISOString().split('T')[0],
        user.lastLogin ? user.lastLogin.toISOString().split('T')[0] : 'Never'
      ])
    ].map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
    res.send(csv);

  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export users'
    });
  }
});

module.exports = router;