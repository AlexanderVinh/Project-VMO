// routes/user.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/user.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/signin', userController.signInView);
router.get('/signup', userController.signUpView);
router.get('/contact', userController.contactView);
router.get('/about', userController.aboutView);
router.get('/blog', userController.blogView);
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.get('/signout', userController.signOut);
router.get('/myprofile', userController.myProfile);
router.post('/changepassword', userController.changePassword);
router.post('/changeProfile', upload.single('avatar'), userController.changeProfile);

module.exports = router;
