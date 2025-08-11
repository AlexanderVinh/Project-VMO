const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Size = require('../models/size.model');

// GET /cart - xem giỏ hàng
exports.getCartView = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Bạn chưa đăng nhập' });

    const listCart = await Cart.find({ user: user._id })
      .populate('product')
      .populate('size');

    let total = 0;
    listCart.forEach(item => {
      total += item.count * item.product.price;
    });

    res.json({ total, listCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// DELETE /cart/:id - xóa món hàng trong giỏ
exports.deleteCart = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Bạn chưa đăng nhập' });

    const { id } = req.params;
    const deleted = await Cart.findOneAndDelete({ _id: id, user: user._id });

    if (!deleted) return res.status(404).json({ message: 'Món hàng không tồn tại hoặc không thuộc bạn' });

    res.json({ message: 'Xóa món hàng thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// PUT /cart/:id - cập nhật số lượng, size món hàng
exports.updateCart = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Bạn chưa đăng nhập' });

    const { id } = req.params;
    const { count, size_id } = req.body;

    const size = size_id ? await Size.findById(size_id) : null;
    if (size_id && !size) return res.status(400).json({ message: 'Size không hợp lệ' });

    const cartItem = await Cart.findOne({ _id: id, user: user._id });
    if (!cartItem) return res.status(404).json({ message: 'Món hàng không tồn tại hoặc không thuộc bạn' });

    cartItem.count = parseInt(count, 10) || cartItem.count;
    cartItem.size = size ? size._id : cartItem.size;

    await cartItem.save();

    res.json({ message: 'Cập nhật giỏ hàng thành công', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// POST /cart - thêm sản phẩm vào giỏ hàng
exports.addToCartPost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Bạn chưa đăng nhập' });

    const { product_id, size_id, count } = req.body;
    if (!product_id || !count) return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc số lượng' });

    let cartItem = await Cart.findOne({ user: user._id, product: product_id, size: size_id });

    if (cartItem) {
      cartItem.count += parseInt(count, 10);
      await cartItem.save();
    } else {
      const product = await Product.findById(product_id);
      if (!product) return res.status(400).json({ message: 'Sản phẩm không tồn tại' });

      const size = size_id ? await Size.findById(size_id) : null;

      const newCart = new Cart({
        user: user._id,
        product: product._id,
        size: size ? size._id : null,
        count: parseInt(count, 10)
      });
      await newCart.save();
    }

    const listCart = await Cart.find({ user: user._id });
    res.json({ message: 'Thêm giỏ hàng thành công', cartCount: listCart.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
