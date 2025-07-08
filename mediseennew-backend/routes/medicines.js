const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

router.post('/add', authenticate, (req, res) => {
  const { medicine_name, schedule_time, schedule_date, is_everyday } = req.body;

  console.log('Received:', req.body); // Debug: See what you get

  db.query(
    'INSERT INTO medicines (user_id, medicine_name, schedule_time, schedule_date, is_everyday) VALUES (?, ?, ?, ?, ?)',
    [
      req.userId,
      medicine_name,
      schedule_time,
      is_everyday ? null : schedule_date,
      Number(!!is_everyday) // <--- THIS IS CRITICAL!
    ],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to add medicine', error: err });
      res.status(201).json({ message: 'Medicine added' });
    }
  );
});



// Get user's medicines
router.get('/', authenticate, (req, res) => {
  db.query(
    'SELECT * FROM medicines WHERE user_id = ?',
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(results);
    }
  );
});

module.exports = router;
