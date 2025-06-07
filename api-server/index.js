// index.js (Express version)

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

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
