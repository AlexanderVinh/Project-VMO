const Size = require('../models/size.model');

module.exports = async function () {
  try {
    await Size.deleteMany();

    const sizes = [
      {
        sizeName: 'S',
        description: 'Size nhỏ dành cho người dưới 55kg',
        created_At: new Date(),
      },
      {
        sizeName: 'M',
        description: 'Size vừa dành cho người từ 55–65kg',
        created_At: new Date(),
      },
      {
        sizeName: 'L',
        description: 'Size lớn dành cho người từ 65–75kg',
        created_At: new Date(),
      },
      {
        sizeName: 'XL',
        description: 'Size rất lớn dành cho người trên 75kg',
        created_At: new Date(),
      },
    ];

    const insertedSizes = await Size.insertMany(sizes);
    console.log(`✅ Đã thêm ${insertedSizes.length} size thành công`);
    insertedSizes.forEach(size => {
      console.log(`📦 ${size.sizeName} - ${size._id}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi thêm Size:', err);
  }
};