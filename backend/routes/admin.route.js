const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Users
router.get("/users", authMiddleware, adminMiddleware, adminController.getAllUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, adminController.deleteUser);

// Products
router.get("/products", authMiddleware, adminMiddleware, adminController.getAllProducts);
router.delete("/products/:id", authMiddleware, adminMiddleware, adminController.deleteProduct);

// Orders (admin)
router.get("/orders", authMiddleware, adminMiddleware, adminController.getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminMiddleware, adminController.updateOrderStatus);

module.exports = router;
