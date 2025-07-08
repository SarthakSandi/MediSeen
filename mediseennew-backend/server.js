const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const userRoutes = require('./routes/user'); // Add user routes for profile completion

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);        // Authentication routes (login/signup)
app.use('/api/medicines', medicineRoutes); // Medicine-related routes
app.use('/api/user', userRoutes);          // User profile routes including complete-profile

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
