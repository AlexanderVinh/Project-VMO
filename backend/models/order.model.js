// models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        size: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Size', 
          required: true 
        },
        count: { 
          type: Number, 
          required: true 
        }
      }
    ],
    totalPrice: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'pending' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
