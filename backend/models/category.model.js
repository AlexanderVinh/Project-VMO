const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_Name: {
    type: String,
    required: true,
    trim: true
  },
  // Danh sách sản phẩm thuộc category này
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  // Danh sách categorySize thuộc category này
  categorySizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategorySize'
    }
  ]
}, {
  timestamps: true // Tự động thêm createdAt, updatedAt
});

module.exports = mongoose.model('Category', categorySchema);
