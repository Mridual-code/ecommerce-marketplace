const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    model: {
      type: String,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String
    },

    color: {
      type: String
    },

    year: {
      type: Number
    },

    fuelType: {
      type: String
    },

    transmission: {
      type: String
    },

    scale: {
      type: String
    },

    material: {
      type: String
    },

    ageGroup: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);