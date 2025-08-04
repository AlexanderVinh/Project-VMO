const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Cart = require('../models/cart.model');
const User = require('../models/User.model');

const listProducts = async (req, res) => {
  try {
    const session = req.session;
    const cookies = req.cookies;

    const error_momo = session.error_momo;
    const NoSignIn = session.NoSignIn;

    session.error_momo = null;
    session.NoSignIn = null;

    let acc = session.acc;
    if (cookies.remember && cookies.user_name) {
      acc = await User.findOne({ user_name: cookies.user_name, role: 'user' });
      session.acc = acc;
      const listCart = await Cart.find({ user_id: acc._id });
      session.countCart = listCart.length;
    }

    if (acc) {
      const listCart = await Cart.find({ user_id: acc._id });
      session.countCart = listCart.length;
    } else {
      session.countCart = 0;
    }

    const bestSellers = await Product.find({}).sort({ sold: -1 }).limit(12);
    const newArrivals = await Product.find({}).sort({ createdAt: -1 }).limit(12);

    res.render('index', {
      error_momo,
      NoSignIn,
      Top12ProductBestSellers: bestSellers,
      Top12ProductNewArrivals: newArrivals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const shop = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find({ isActive: 1 }).limit(12);
    const categories = await Category.find();

    res.render('shop', {
      TotalPro: totalProducts,
      listProduct: products,
      listCategory: categories,
      search_input: req.session.search_input || '',
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const shopPage = async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const pageSize = 12;

    const products = await Product.find().skip(pageId * pageSize).limit(pageSize);
    const categories = await Category.find();
    const totalProducts = await Product.countDocuments();

    res.render('shop', {
      TotalPro: totalProducts,
      listProduct: products,
      listCategory: categories,
      search_input: req.session.search_input || '',
      user_Name: req.session.acc?.user_name || null,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const productDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.redirect('/home');

    const relatedProduct = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    }).limit(4);

    res.render('shop-details', { product, relatedProduct });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const search = (req, res) => {
  req.session.search_input = req.body['search-input'];
  return res.redirect('/search/0');
};

const searchPage = async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const pageSize = 12;
    const searchInput = req.session.search_input;

    if (!searchInput) {
      const categories = await Category.find();
      return res.render('shop', {
        TotalPro: 0,
        search_input: null,
        listProduct: null,
        listCategory: categories,
        noPageable: 'search',
      });
    }

    const totalMatch = await Product.find({ product_Name: { $regex: searchInput, $options: 'i' } });
    const products = await Product.find({ product_Name: { $regex: searchInput, $options: 'i' } })
      .skip(pageId * pageSize)
      .limit(pageSize);
    const categories = await Category.find();

    res.render('shop', {
      TotalPro: totalMatch.length,
      search_input: searchInput,
      listProduct: products,
      listCategory: categories,
      noPageable: 'search',
      pageSearch: 'pageSearch',
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const blogDetails = (req, res) => {
  res.render('blog-details');
};

module.exports = {
  listProducts,
  shop,
  shopPage,
  productDetail,
  search,
  searchPage,
  blogDetails,
};
