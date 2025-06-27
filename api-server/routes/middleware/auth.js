// routes/middleware/auth.js
const jwt = require('jsonwebtoken');
const { Admin, User } = require('../../models');

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

// Admin authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin token
    if (!decoded.adminId) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Verify admin exists and is active
    const admin = await Admin.findByPk(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin access denied'
      });
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      isSuperadmin: admin.isSuperadmin
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin token'
    });
  }
};

// Super admin only
const requireSuperAdmin = async (req, res, next) => {
  if (!req.admin || !req.admin.isSuperadmin) {
    return res.status(403).json({
      success: false,
      message: 'Super admin access required'
    });
  }
  next();
};

// Verify user owns the resource
const verifyOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await model.findByPk(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check if user owns the resource
      if (resource.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to verify ownership'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authenticateAdmin,
  requireSuperAdmin,
  verifyOwnership
};