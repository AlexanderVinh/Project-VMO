const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/web_ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function runSeeds() {
  try {
    console.log('🚀 Bắt đầu seed dữ liệu...');

    await require('./seedUsers')();            // 1. User
    await require('./seedCategories')();       // 2. Category
    await require('./seedSizes')();            // 3. Size
    await require('./seedCategorySizes')();    // 4. CategorySize (liên kết Category & Size)
    await require('./seedProducts')();         // 5. Product (phụ thuộc Category)
    await require('./seedProductImages')();    // 6. ProductImage (phụ thuộc Product)
    await require('./seedCarts')();            // 7. Cart (phụ thuộc User, Product, Size)
    await require('./seedOrders')();           // 8. Order (phụ thuộc User)
    await require('./seedOrderItems')();       // 9. OrderItem (phụ thuộc Order, Product, Size)
    console.log('✅ Seed hoàn tất!');
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err);
  } finally {
    mongoose.disconnect();
  }
}

runSeeds();