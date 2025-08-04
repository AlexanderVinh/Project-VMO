const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Vì bạn không sử dụng auto-generated ID trong Java
    login_Type: { type: String, trim: true },
    role: { type: String, trim: true }, // Ví dụ: "user", "admin"
    password: { type: String, required: true },
    user_Name: { type: String, trim: true },
    avatar: { type: String }, // Có thể là URL ảnh
    email: { type: String, trim: true },
    status: { type: Number, default: 1 },
    phone_Number: { type: String, trim: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
  },
  { _id: false, timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
