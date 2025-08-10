const CategorySize = require('../models/categorySize.model');
const Category = require('../models/category.model');
const Size = require('../models/size.model');

module.exports = async function () {
  try {
    await CategorySize.deleteMany();

    const category = await Category.findOne({ category_Name: 'Áo thun' });
    const sizes = await Size.find({ sizeName: { $in: ['S', 'M', 'L'] } });

    if (!category || sizes.length === 0) {
      throw new Error('❌ Không tìm thấy category hoặc size phù hợp');
    }

    const links = sizes.map(size => ({
      category: category._id,
      size: size._id,
    }));

    const inserted = await CategorySize.insertMany(links);
    console.log(`✅ Đã thêm ${inserted.length} liên kết Category ↔ Size`);
    inserted.forEach(link => {
      console.log(`🔗 Category ${link.category} ↔ Size ${link.size}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi thêm CategorySize:', err);
  }
};