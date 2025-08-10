const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/user.controller');
const User = require('../models/user.model');

// Multer cấu hình lưu ảnh đại diện
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* --------------------- VIEW ROUTES --------------------- */
router.get('/signin', userController.signInView);
router.get('/signup', userController.signUpView);
router.get('/contact', userController.contactView);
router.get('/about', userController.aboutView);
router.get('/blog', userController.blogView);

/* --------------------- AUTH ROUTES --------------------- */
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.get('/signout', userController.signOut);

/* --------------------- PROFILE ROUTES --------------------- */
router.get('/myprofile', userController.myProfile);
router.post('/changepassword', userController.changePassword);
router.post('/changeProfile', upload.single('avatar'), userController.changeProfile);

/* --------------------- API ROUTES --------------------- */

// Middleware bảo vệ API
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  }
  next();
};

// GET /users - trả về danh sách người dùng
router.get('/users', requireLogin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // ẩn mật khẩu
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
  }
});



module.exports = router;
