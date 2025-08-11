// orderItem.route.js
const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItem.controller");

router.post("/", orderItemController.createOrderItem);

module.exports = router;
