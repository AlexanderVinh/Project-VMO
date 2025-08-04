const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    booking_Date: {
      type: Date,
      default: Date.now,
    },
    payment_Method: {
      type: String,
      default: 'COD', // Có thể là "COD", "VNPay", "Paypal", ...
      trim: true,
    },
    status: {
      type: String,
      default: 'Pending', // Pending, Confirmed, Shipping, Delivered, Cancelled
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order_Item: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
