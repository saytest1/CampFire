// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Database
const db = require('./models');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  fs.mkdirSync(path.join(uploadsDir, 'products'));
  fs.mkdirSync(path.join(uploadsDir, 'categories'));
  fs.mkdirSync(path.join(uploadsDir, 'users'));
  fs.mkdirSync(path.join(uploadsDir, 'reviews'));
}

// Routes
app.use('/api', require('./routes/root'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Sync database and start server
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 CampReady Rentals API Server is running at http://localhost:${PORT}`);
      console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
  });