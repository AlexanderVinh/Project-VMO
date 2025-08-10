const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

// Helper: Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Views (render HTML or trả client tùy bạn)
exports.signInView = (req, res) => {
  res.render("signin"); // hoặc res.send("Sign In page");
};

exports.signUpView = (req, res) => {
  res.render("signup");
};

exports.contactView = (req, res) => {
  res.render("contact");
};

exports.aboutView = (req, res) => {
  res.render("about");
};

exports.blogView = (req, res) => {
  res.render("blog");
};

// POST /signin
exports.signIn = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ message: "Incorrect password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      path: "/api/user/refresh",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// POST /signup
exports.signUp = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "Register successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /signout
exports.signOut = (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/user/refresh" });
  res.status(200).json({ message: "Logged out successfully" });
};

// GET /myprofile
exports.myProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // giả sử bạn có middleware xác thực lưu req.user
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// POST /changepassword
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const validOld = await bcrypt.compare(oldPassword, user.password);
    if (!validOld) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err.message });
  }
};

// POST /changeProfile
exports.changeProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Nếu có upload file avatar thì req.file
    if (req.file) {
      // Xóa avatar cũ nếu có
      if (user.avatar) {
        const oldPath = path.join(__dirname, "..", user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.avatar = req.file.path; // lưu path file mới
    }

    // Cập nhật các trường khác nếu có trong req.body (ví dụ: phone, email,...)
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.email) user.email = req.body.email;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
