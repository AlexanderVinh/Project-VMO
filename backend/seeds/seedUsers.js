const User = require('../models/user.model');

module.exports = async function () {
  try {
    await User.deleteMany();

    const users = [
      {
        username: 'tranvana',
        email: 'tran@example.com',
        password: '123456', // 🔐 Nên hash nếu dùng thực tế
        phone: '0123456789',
        role: 'user',
      },
      {
        username: 'adminrabbit',
        email: 'admin@rabbit.com',
        password: 'admin123',
        phone: '0987654321',
        role: 'admin',
      },
    ];

    const inserted = await User.insertMany(users);
    console.log(`✅ Đã thêm ${inserted.length} user thành công`);
    inserted.forEach(u => {
      console.log(`👤 ${u.username} - ${u.role} - ${u._id}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi thêm User:', err);
  }
};