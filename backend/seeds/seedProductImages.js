const ProductImage = require('../models/productImage.model');
const Product = require('../models/product.model');

module.exports = async function () {
  try {
    await ProductImage.deleteMany();

    const products = await Product.find().limit(2);

    if (products.length === 0) {
      throw new Error('❌ Không tìm thấy sản phẩm nào để gán ảnh');
    }

    const imageData = [];

    for (const product of products) {
      const images = [
        {
          url_Image: `https://example.com/images/${product._id}-1.jpg`,
          product: product._id,
        },
        {
          url_Image: `https://example.com/images/${product._id}-2.jpg`,
          product: product._id,
        },
      ];

      imageData.push(...images);
    }

    const insertedImages = await ProductImage.insertMany(imageData);

    // Gán ảnh vào productImages của từng sản phẩm
    for (const product of products) {
      const relatedImages = insertedImages
        .filter(img => img.product.toString() === product._id.toString())
        .map(img => img._id);

      product.productImages = relatedImages;
      await product.save();
    }

    console.log(`🖼️ Đã thêm ${insertedImages.length} ảnh sản phẩm thành công`);
  } catch (err) {
    console.error('❌ Lỗi khi thêm ProductImage:', err);
  }
};