const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  count: { type: Number, required: true },
  size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
