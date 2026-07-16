const mongoose = require("mongoose");

const trackingHistorySchema =
  new mongoose.Schema(
    {
      status: {
        type: String,
        required: true
      },

      timestamp: {
        type: Date,
        default: Date.now
      }
    },
    {
      _id: false
    }
  );

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    },

    estimatedDeliveryDate: {
      type: Date,
      required: true
    },

    deliveredAt: {
      type: Date,
      default: null
    },

    trackingHistory: {
      type: [trackingHistorySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);