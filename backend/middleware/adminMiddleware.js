  // middlewares/adminMiddleware.js
  const adminMiddleware = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
    next();
  };

  module.exports = adminMiddleware;
