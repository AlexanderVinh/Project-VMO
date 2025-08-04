const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users", error: err });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user", error: err });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().populate("category");
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Error fetching products", error: err });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting product", error: err });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate("user");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Error fetching orders", error: err });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status: req.body.status },
        { new: true }
      );
      if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ message: "Error updating order status", error: err });
    }
  }
};

module.exports = adminController;
