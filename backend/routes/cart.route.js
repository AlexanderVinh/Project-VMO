const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware.verifyToken); // Bảo vệ toàn bộ route

router.get("/", cartController.getUserCart);
router.post("/", cartController.addToCart);
router.put("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.removeCartItem);

module.exports = router;
