const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// User routes
// ==========================

// Tạo đơn hàng
router.post("/", authMiddleware, orderController.createOrder);

// Lấy tất cả đơn hàng của user đang đăng nhập
router.get("/my-orders", authMiddleware, orderController.getOrdersByUser);

// Lấy chi tiết một đơn hàng (user chỉ xem đơn của mình)
router.get("/:id", authMiddleware, orderController.getOrdersByUser);

module.exports = router;
