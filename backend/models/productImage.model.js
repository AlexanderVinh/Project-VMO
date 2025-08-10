const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  url_Image: {
    type: String,
    required: true,
    trim: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Liên kết tới bảng Product
    required: true
  }
}, {
  timestamps: true // Tự động thêm createdAt, updatedAt
});

module.exports = mongoose.model('ProductImage', productImageSchema);
