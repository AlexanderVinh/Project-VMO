const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Size = require('../models/size.model');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm nào trong đơn hàng.' });
    }

    const validatedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      const size = await Size.findById(item.size);

      if (!product || !size) {
        return res.status(400).json({ message: 'Sản phẩm hoặc kích thước không hợp lệ.' });
      }

      validatedItems.push({
        product: product._id,
        size: size._id,
        count: item.count,
      });

      totalPrice += product.price * item.count;
    }

    const order = new Order({
      items: validatedItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: 'pending',
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .populate('items.size');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    res.status(500).json({ message: error.message });
  }
};