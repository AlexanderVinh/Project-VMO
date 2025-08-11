// controllers/order.controller.js
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const user = req.user; // Lấy user từ authMiddleware
    const {
      orderItems, // mảng id của OrderItem
      fullname,
      country,
      address,
      phone,
      email,
      note,
      payment_Method
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không được để trống" });
    }

    // Tính tổng tiền từ orderItems
    let total = 0;
    for (let itemId of orderItems) {
      const orderItem = await OrderItem.findById(itemId).populate("product", "price");
      if (!orderItem) {
        return res.status(400).json({ message: `OrderItem ${itemId} không tồn tại` });
      }
      total += orderItem.product.price * orderItem.count;
    }

    // Tạo đơn hàng
    const newOrder = new Order({
      total,
      fullname,
      country,
      address,
      phone,
      email,
      note,
      payment_Method: payment_Method || "COD",
      status: "Pending",
      user: user._id,
      order_Item: orderItems
    });

    const savedOrder = await newOrder.save();

    // Cập nhật orderId cho các orderItem
    await OrderItem.updateMany(
      { _id: { $in: orderItems } },
      { $set: { order: savedOrder._id } }
    );

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "order_Item",
        populate: [
          { path: "product", select: "name price" },
          { path: "size", select: "name" }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "order_Item",
        populate: [
          { path: "product", select: "name price" },
          { path: "size", select: "name" }
        ]
      });

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật đơn hàng
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Xóa luôn các OrderItem liên quan
    await OrderItem.deleteMany({ order: order._id });

    res.json({ message: "Xoá đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
