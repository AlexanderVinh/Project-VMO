const mongoose = require('mongoose');

const categorySizeSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true },
});

module.exports = mongoose.model('CategorySize', categorySizeSchema);
