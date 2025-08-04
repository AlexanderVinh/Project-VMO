const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    sizeName: { type: String, required: true },
    description: { type: String },
    created_At: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Size', sizeSchema);
