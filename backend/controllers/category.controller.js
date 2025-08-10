const Category = require('../models/category.model');
const Product = require('../models/product.model');

// Lấy danh sách sản phẩm theo category (trang đầu tiên)
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params; // id category
    const page = 0; // trang đầu tiên
    const limit = 12;

    // Lấy sản phẩm theo category và isActive = 1
    const products = await Product.find({ category: id, isActive: 1 })
      .limit(limit)
      .skip(page * limit);

    // Lấy thông tin category
    const category = await Category.findById(id).populate('product');

    // Lấy toàn bộ category
    const listCategory = await Category.find();

    const totalPro = category?.product?.length || 0;

    return res.json({
      TotalPro: totalPro,
      listCategory,
      search_input: null,
      listProduct: products,
      idCate: id,
      noPageable: 'category'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy danh sách sản phẩm theo category và số trang
exports.getCategoryPage = async (req, res) => {
  try {
    const { id, p } = req.params; // id category và số trang
    const page = parseInt(p) || 0;
    const limit = 12;

    const products = await Product.find({ category: id, isActive: 1 })
      .limit(limit)
      .skip(page * limit);

    const category = await Category.findById(id).populate('product');
    const listCategory = await Category.find();

    const totalPro = category?.product?.length || 0;

    return res.json({
      TotalPro: totalPro,
      listCategory,
      search_input: null,
      listProduct: products,
      referer: req.get('Referer') || null,
      idCate: id,
      noPageable: 'category'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
