const OrderItem = require('../models/orderItem.model');
const Product = require('../models/product.model');
const Size = require('../models/size.model');
const Order = require('../models/order.model');

module.exports = async function () {
  try {
    await OrderItem.deleteMany();

    const product = await Product.findOne();
    const size = await Size.findOne();
    const order = await Order.findOne();

    if (!product || !size || !order) {
      throw new Error('❌ Thiếu product, size hoặc order để tạo OrderItem');
    }

    const item = await OrderItem.create({
      count: 2,
      size: size._id,
      product: product._id,
      order: order._id,
    });

    console.log('✅ Đã thêm OrderItem thành công:', item._id);
  } catch (err) {
    console.error('❌ Lỗi khi thêm OrderItem:', err);
  }
};