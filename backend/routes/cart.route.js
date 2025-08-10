const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const cartController = require("../controllers/cart.controller");

router.get("/", authMiddleware, cartController.getCartView);
router.post("/", authMiddleware, cartController.addToCartPost);
router.put("/:itemId", authMiddleware, cartController.updateCart);
router.delete("/:itemId", authMiddleware, cartController.deleteCart);

// Nếu bạn có hàm clearCart và getAllCarts, dùng adminMiddleware cho route admin
// router.delete("/", authMiddleware, cartController.clearCart);
// router.get("/all", authMiddleware, adminMiddleware, cartController.getAllCarts);

module.exports = router;
