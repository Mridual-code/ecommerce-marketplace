const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index(
  {
    name: 1,
    department: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("Category", categorySchema);