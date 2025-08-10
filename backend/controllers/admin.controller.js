const User = require('../models/user.model');
const Product = require("../models/product.model");
const Order = require("../models/order.model");

const adminController = {
  // Lấy tất cả user
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password"); // ẩn password
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users", error: err.message });
    }
  },

  // Xóa user
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user", error: err.message });
    }
  },

  // Lấy tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().populate("category");
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Error fetching products", error: err.message });
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting product", error: err.message });
    }
  },

  // Lấy tất cả đơn hàng
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate("user");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status: req.body.status },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ message: "Error updating order status", error: err.message });
    }
  }
};

module.exports = adminController;
