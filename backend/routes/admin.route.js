const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// Users
router.get("/users", authMiddleware, adminMiddleware, adminController.getAllUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, adminController.deleteUser);

// Products
router.get("/products", authMiddleware, adminMiddleware, adminController.getAllProducts);
router.delete("/products/:id", authMiddleware, adminMiddleware, adminController.deleteProduct);

// Orders
router.get("/orders", authMiddleware, adminMiddleware, adminController.getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminMiddleware, adminController.updateOrderStatus);

module.exports = router;
