const Product = require('../models/product.model');
const Category = require('../models/category.model');

module.exports = async function () {
  try {
    await Product.deleteMany();

    const category = await Category.findOne({ category_Name: 'Áo thun' });

    if (!category) {
      throw new Error('❌ Không tìm thấy category "Áo thun"');
    }

    const products = [
      {
        product_Name: 'Áo thun Rabbit Basic',
        description: 'Áo thun cotton 100%, thiết kế đơn giản, thoáng mát',
        price: 199000,
        quantity: 100,
        category: category._id,
        sold: 0,
        isActive: true,
        is_Selling: true,
        productImages: [], // 👈 Nếu chưa có ảnh, để trống
      },
      {
        product_Name: 'Áo thun Rabbit Graphic',
        description: 'Áo thun in hình nghệ thuật, phong cách trẻ trung',
        price: 249000,
        quantity: 80,
        category: category._id,
        sold: 0,
        isActive: true,
        is_Selling: true,
        productImages: [],
      },
    ];

    const inserted = await Product.insertMany(products);
    console.log(`✅ Đã thêm ${inserted.length} sản phẩm thành công`);
    inserted.forEach(p => {
      console.log(`🛍️ ${p.product_Name} - ${p._id}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi thêm Product:', err);
  }
};