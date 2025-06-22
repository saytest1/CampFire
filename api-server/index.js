// index.js

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Load users from JSON
const usersFilePath = path.join(__dirname, 'data', 'users.json');
let users = [];

try {
  const rawData = fs.readFileSync(usersFilePath, 'utf-8');
  users = JSON.parse(rawData);
} catch (err) {
  console.error('❌ Failed to load users.json:', err.message);
}

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.status(200).json({ message: '✅ Login successful' });
  } else {
    res.status(401).json({ message: '❌ Login failed' });
  }
});

// Routers
const root = require('./routes/root');
const categories = require('./routes/categories');
const products = require('./routes/products');

app.use('/', root); // nếu root là express.Router()
app.use('/categories', categories);
app.use('/products', products);

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
