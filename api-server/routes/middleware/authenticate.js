// api-server/middlewares/auth.js

const jwt = require('jsonwebtoken');
const { Admin } = require('../models'); 
const SECRET_KEY = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function authorizeAdmin(req, res, next) {
  const { userId } = req.user || {}; 
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const admin = await Admin.findByPk(userId);
    if (!admin || !admin.is_superadmin || !admin.is_active) {
      return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  authenticateToken,
  authorizeAdmin
};