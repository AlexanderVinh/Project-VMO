const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Size = require('../models/size.model');

// GET /cart
exports.getCartView = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      req.session.NoSignIn = 'Vui lòng đăng nhập trước khi thực hiện thao tác';
      return res.redirect('/home');
    }

    const listCart = await Cart.find({ user: user._id })
      .populate('product')
      .populate('size');

    let total = 0;
    listCart.forEach(item => {
      total += item.count * item.product.price;
    });

    req.session.listCart = listCart;
    req.session.Total = total;

    // Nếu là API trả JSON:
    // return res.json({ total, listCart });
    // Nếu render view:
    return res.render('shopping-cart', { Total: total, listCart });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// GET /deleteCart/:id
exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const referer = req.get('Referer') || '/';
    const user = req.session.user;

    if (!user) {
      return res.redirect(referer);
    }

    await Cart.findByIdAndDelete(id);

    const listCart = await Cart.find({ user: user._id });
    req.session.countCart = listCart.length;

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// POST /updateCart
exports.updateCart = async (req, res) => {
  try {
    const listCart = req.session.listCart || [];
    let i = 0;

    for (let cartItem of listCart) {
      const count = parseInt(req.body[`count${i}`], 10);
      const sizeId = req.body[`size${i}`];

      const size = await Size.findById(sizeId);

      await Cart.findByIdAndUpdate(cartItem._id, {
        count,
        size: size ? size._id : cartItem.size
      });

      i++;
    }

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// GET /addToCart/:id/:sizeId
exports.addToCart = async (req, res) => {
  try {
    const { id, sizeId } = req.params;
    const referer = req.get('Referer') || '/';
    const user = req.session.user;

    if (!user) {
      req.session.AddToCartErr = 'Please signin before proceeding to cart';
      return res.redirect(referer);
    }

    let cartItem = await Cart.findOne({ user: user._id, product: id, size: sizeId });

    if (cartItem) {
      cartItem.count += 1;
      await cartItem.save();
    } else {
      const product = await Product.findById(id);
      const size = await Size.findById(sizeId);

      if (!product) {
        return res.redirect(referer);
      }

      const newCart = new Cart({
        count: 1,
        product: product._id,
        size: size ? size._id : null,
        user: user._id
      });
      await newCart.save();
    }

    const listCart = await Cart.find({ user: user._id });
    req.session.countCart = listCart.length;

    res.redirect(referer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// POST /addToCart
exports.addToCartPost = async (req, res) => {
  try {
    const { product_id, size_id, count } = req.body;
    const referer = req.get('Referer') || '/';
    const user = req.session.user;

    if (!user) {
      req.session.AddToCartErr = 'Please signin before proceeding to cart';
      return res.redirect(referer);
    }

    let cartItem = await Cart.findOne({ user: user._id, product: product_id, size: size_id });

    if (cartItem) {
      cartItem.count += parseInt(count, 10);
      await cartItem.save();
    } else {
      const product = await Product.findById(product_id);
      const size = await Size.findById(size_id);

      if (!product) {
        return res.redirect(referer);
      }

      const newCart = new Cart({
        count: parseInt(count, 10),
        product: product._id,
        size: size ? size._id : null,
        user: user._id
      });
      await newCart.save();
    }

    const listCart = await Cart.find({ user: user._id });
    req.session.countCart = listCart.length;

    res.redirect(referer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
