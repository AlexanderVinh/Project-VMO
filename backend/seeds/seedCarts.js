const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Size = require('../models/size.model');

module.exports = async function () {
  try {
    await Cart.deleteMany();

    const user = await User.findOne();
    const products = await Product.find().limit(2);
    const sizes = await Size.find().limit(2);

    if (!user || products.length === 0 || sizes.length === 0) {
      throw new Error('❌ Thiếu user, product hoặc size để tạo giỏ hàng');
    }

    const cartItems = [];

    for (let i = 0; i < products.length; i++) {
      cartItems.push({
        count: Math.floor(Math.random() * 3) + 1, // Số lượng từ 1–3
        user: user._id.toString(),                // Vì user là String
        product: products[i]._id,
        size: sizes[i % sizes.length]._id,        // Lặp size nếu thiếu
      });
    }

    const inserted = await Cart.insertMany(cartItems);
    console.log(`✅ Đã thêm ${inserted.length} sản phẩm vào giỏ hàng`);
    inserted.forEach(item => {
      console.log(`🛒 ${item.count} x ${item.product} (Size: ${item.size})`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi thêm Cart:', err);
  }
};