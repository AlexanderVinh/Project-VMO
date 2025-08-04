const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    product_Name: { type: String, required: true, trim: true },
    description: { type: String },
    sold: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    is_Selling: { type: Boolean, default: true },
    created_At: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    productImage: [{ type: String }], // URLs or filenames
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
