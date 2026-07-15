const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: "",
      trim: true
    },

    startingPrice: {
      type: Number,
      required: true,
      min: 0
    },

    duration: {
      type: String,
      required: true,
      trim: true
    },

    features: [
      {
        type: String,
        trim: true
      }
    ],

    isAvailable: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Service",
  serviceSchema
);