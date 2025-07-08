// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.length > 0) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Insert failed', error: err });

          const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

          const user = {
            id: result.insertId,
            name,
            email,
            ProfileComplete: false,
          };

          res.status(201).json({ token, user });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      address: user.address,
      medicalConditions: user.medical_conditions,
      currentMedications: user.current_medications,
      phone: user.phone,
      profileComplete: !!user.isProfileComplete,
      }
    });
  });
});

module.exports = router;
