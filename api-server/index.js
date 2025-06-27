<<<<<<< HEAD
// index.js
=======
>>>>>>> f8de0e727ffab2d03ee8342f4b02adddde9e12f6
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Database
const db = require('./models');

<<<<<<< HEAD
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
=======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

const usersFilePath = path.join(__dirname, 'data', 'users.json');
let users = [];

try {
  const rawData = fs.readFileSync(usersFilePath, 'utf-8');
  users = JSON.parse(rawData);
} catch (err) {
  console.error('Failed to load users.json:', err.message);
}

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
});

const root = require('./routes/root');
const categories = require('./routes/categories');
const products = require('./routes/products');

app.use('/', root); 
app.use('/categories', categories);
app.use('/products', products);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
>>>>>>> f8de0e727ffab2d03ee8342f4b02adddde9e12f6
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