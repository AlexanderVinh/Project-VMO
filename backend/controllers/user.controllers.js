const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

// Helper: Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// [POST] /register
exports.register = async (req, res) => {
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
      role: "user", // default role
    });

    await newUser.save();
    res.status(201).json({ message: "Register successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// [POST] /login
exports.login = async (req, res) => {
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
      secure: false, // set to true in production with HTTPS
      path: "/api/user/refresh",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// [POST] /refresh
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, userData) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = generateAccessToken(userData);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ message: "Token refresh error", error: err.message });
  }
};

// [GET] /me
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// [POST] /logout
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/user/refresh" });
  res.status(200).json({ message: "Logged out successfully" });
};
