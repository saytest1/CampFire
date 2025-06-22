const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

router.post('/', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Server error when reading users file.' });
    }

    const users = JSON.parse(data);
    const foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({ message: 'Login successful' });
  });
});

module.exports = router;
