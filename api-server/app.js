// app.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');

// Import models để setup relationships
require('./models');

// Import routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/images', express.static('public/images'));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Camping Equipment API',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products'
    }
  });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Lỗi server'
  });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ force: false });
    console.log('✅ Models synced');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server start failed:', error);
  }
};

startServer();