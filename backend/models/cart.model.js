const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      required: true,
    },
    user: {
      type: String, // vì user._id là String theo thiết kế bạn đã đưa
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
