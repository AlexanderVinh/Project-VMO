const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// Users
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);

// Products
router.get("/products", adminController.getAllProducts);
router.delete("/products/:id", adminController.deleteProduct);

// Orders
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

module.exports = router;
