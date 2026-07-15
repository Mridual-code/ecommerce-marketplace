const mongoose = require("mongoose");

const vehicleDetailsSchema =
  new mongoose.Schema(
    {
      brand: {
        type: String,
        required: true,
        trim: true
      },

      model: {
        type: String,
        required: true,
        trim: true
      },

      year: {
        type: Number,
        required: true,
        min: 1900
      },

      registrationNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      }
    },
    {
      _id: false
    }
  );

const serviceBookingSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
      },

      serviceName: {
        type: String,
        required: true,
        trim: true
      },

      servicePrice: {
        type: Number,
        required: true,
        min: 0
      },

      vehicleDetails: {
        type: vehicleDetailsSchema,
        required: true
      },

      bookingDate: {
        type: Date,
        required: true
      },

      timeSlot: {
        type: String,
        required: true,
        trim: true
      },

      address: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        match: [
          /^[0-9]{10}$/,
          "Phone number must contain 10 digits"
        ]
      },

      notes: {
        type: String,
        default: "",
        trim: true
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Confirmed",
          "In Progress",
          "Completed",
          "Cancelled"
        ],
        default: "Pending"
      }
    },
    {
      timestamps: true
    }
  );

module.exports = mongoose.model(
  "ServiceBooking",
  serviceBookingSchema
);