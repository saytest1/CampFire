// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Cart } = require('../models');
const { authenticateToken } = require('./middleware/auth');
const { sendEmail } = require('../utils/email');

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().trim(),
  body('phone').optional().isMobilePhone('vi-VN')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password, fullName, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      phone,
      verificationToken
    });

    // Create cart for user
    await Cart.create({ userId: user.id });

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your CampReady account',
        html: `
          <h2>Welcome to CampReady Rentals!</h2>
          <p>Please click the link below to verify your email:</p>
          <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}">
            Verify Email
          </a>
        `
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find and update user
    const user = await User.findOne({ 
      where: { 
        email: decoded.email,
        verificationToken: token 
      } 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    await user.update({
      isVerified: true,
      verificationToken: null
    });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user info'
    });
  }
});

// Forgot password
router.post('/forgot-password', 
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: 'If email exists, reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Save token and expiry
      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
      });

      // Send email
      try {
        await sendEmail({
          to: email,
          subject: 'Reset your CampReady password',
          html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
              Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
          `
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }

      res.json({
        success: true,
        message: 'If email exists, reset link has been sent'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process request'
      });
    }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { token, password } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { [db.Sequelize.Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// Logout (optional - mainly for token blacklisting if implemented)
router.post('/logout', authenticateToken, (req, res) => {
  // In a real app, you might want to blacklist the token here
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;