const Order = require('../models/order.model');
const User = require('../models/user.model');
const OrderItem = require('../models/orderItem.model');

module.exports = async function () {
  try {
    await Order.deleteMany();

    const user = await User.findOne();
    const orderItems = await OrderItem.find().limit(2);

    if (!user || orderItems.length === 0) {
      throw new Error('❌ Thiếu user hoặc orderItem để tạo đơn hàng');
    }

    const order = await Order.create({
      total: 398000,
      booking_Date: new Date(),
      payment_Method: 'COD',
      status: 'Pending',
      fullname: 'Tran Van A',
      country: 'Vietnam',
      address: '123 Mai Dịch, Cầu Giấy, Hà Nội',
      phone: '0123456789',
      email: 'tran@example.com',
      note: 'Giao hàng giờ hành chính',
      user: user._id,
      order_Item: orderItems.map(item => item._id),
    });

    console.log('✅ Đã thêm Order thành công:', order._id);
  } catch (err) {
    console.error('❌ Lỗi khi thêm Order:', err);
  }
};