const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// In your backend routes/user.js
router.put('/complete-profile', verifyToken, (req, res) => {
  const userId = req.userId;
  const { name, age, gender, address, medicalConditions, currentMedications, phone } = req.body;
  if (!name || !age || !gender || !phone || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const query = `
  UPDATE users 
  SET name = ?, age = ?, gender = ?, address = ?, medical_conditions = ?, 
      current_medications = ?, phone = ?, isProfileComplete = TRUE
  WHERE id = ?
`;
db.query(
  query,
  [name, age, gender, address, medicalConditions, currentMedications, phone, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating profile', error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});


// GET /api/user/profile
router.get('/profile', verifyToken, (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = results[0];
    // Return profileComplete as boolean
    res.json({
      user: {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      address: user.address, // <--- add this
      medicalConditions: user.medical_conditions,
      currentMedications: user.current_medications, // <--- add this
      phone: user.phone,
      profileComplete: !!user.isProfileComplete,
    }
    });
  });
});

module.exports = router;
