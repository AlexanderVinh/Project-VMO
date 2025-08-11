// orderItem.controller.js
const OrderItem = require("../models/orderItem.model");

exports.createOrderItem = async (req, res) => {
  try {
    const { count, size, product } = req.body;

    if (!count || !size || !product) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const newOrderItem = new OrderItem({
      count,
      size,
      product
    });

    await newOrderItem.save();
    res.status(201).json(newOrderItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
