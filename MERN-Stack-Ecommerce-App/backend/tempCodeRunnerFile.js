const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const seedDB = require('./seed/productSeeds');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const authRoutes = require('./routes/auth');

// Create Express App
const app = express();
const PORT = process.env.PORT || 8000;

// Database Connection
const connectDB = require('./config/db'); // or wherever your connectDB.js is
connectDB();
// Add these near your other route imports
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

// Add these with your other route middleware
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect root to /api-docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});



// Routes
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/search', require('./routes/search'));
app.use('/api/auth', authRoutes);

// Seed database on startup
seedDB().then(() => {
  // Start Server after seeding
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready on port ${PORT}.`);
  });
});
