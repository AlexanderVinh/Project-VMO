const Category = require('../models/category.model');

module.exports = async function () {
  try {
    await Category.deleteMany();

    const categories = [
      { category_Name: 'Áo thun', product: [], categorySizes: [] },
      { category_Name: 'Quần jeans', product: [], categorySizes: [] },
      { category_Name: 'Giày sneaker', product: [], categorySizes: [] },
      { category_Name: 'Phụ kiện', product: [], categorySizes: [] },
    ];

    const inserted = await Category.insertMany(categories);
    console.log(`✅ Đã thêm ${inserted.length} category thành công`);
    inserted.forEach(cat => {
      console.log(`🗂️ ${cat.category_Name} - ${cat._id}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi thêm Category:', err);
  }
};