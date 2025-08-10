require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
const session = require('express-session');           // <-- thêm express-session
const cookieParser = require('cookie-parser');        // <-- thêm cookie-parser để xử lý cookie
const connectDB = require('./config/db');

const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());                              // <-- đăng ký cookie-parser

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',  // bí mật session, tốt nhất lưu trong .env
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,    // true nếu dùng HTTPS, false khi dev local
    maxAge: 1000 * 60 * 60 * 24   // thời gian sống cookie (1 ngày)
  }
}));

// Routes chính
const routes = require('./routes');
app.use('/api', routes);

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error('❌ Lỗi:', err.message);
  res.status(500).json({ message: 'Lỗi server!' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy ở cổng ${PORT}`));
