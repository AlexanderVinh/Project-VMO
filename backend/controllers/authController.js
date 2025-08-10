const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "Email or username already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      role: role || "user",
    });

    res.status(201).json({
      message: "Register successful",
      user: { id: user._id, email: user.email, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // path: "/", // <-- mở rộng nếu muốn cookie gửi trong nhiều request
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: { id: user._id, email: user.email, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAccessToken = createAccessToken(user);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};
