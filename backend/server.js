require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes chính
const routes = require('./routes');
app.use('/api', routes);

// Nếu bạn có thêm các routes riêng biệt không dùng index.js
// app.use('/api/v1/payment', require('./routes/vnpay.routes'));

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error('❌ Lỗi:', err.message);
  res.status(500).json({ message: 'Lỗi server!' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy ở cổng ${PORT}`));
