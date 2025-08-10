const express = require('express');
const router = express.Router();

// Import các route con
router.use('/auth', require('./authRoutes'));       // authRoutes.js
router.use('/users', require('./user.route'));     // user.route.js
router.use('/products', require('./product.route')); // product.route.js
router.use('/orders', require('./order.route'));     // order.route.js
router.use('/cart', require('./cart.route'));        // cart.route.js
router.use('/admin', require('./admin.route'));      // admin.route.js

module.exports = router;
