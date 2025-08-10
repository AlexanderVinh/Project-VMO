// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// register, login
router.post("/register", authController.register);
router.post("/login", authController.login);

// refresh token (cookie path was set to /api/auth/refresh-token)
router.post("/refresh-token", authController.refreshToken);

// logout
router.post("/logout", authController.logout);

module.exports = router;
