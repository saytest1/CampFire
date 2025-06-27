const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const fs = require('fs');

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
});
