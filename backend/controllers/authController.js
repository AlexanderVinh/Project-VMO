const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

exports.register = async (req, res) => {
  const { user_Name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      user_Name,
      email,
      password: hashed,
      role: role || "user"
    });

    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
