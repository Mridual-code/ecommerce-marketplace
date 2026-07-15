const Service = require("../models/Service");
const ServiceBooking = require(
  "../models/ServiceBooking"
);

/*
  Create a service booking
  Access: Customer
*/
const createServiceBooking = async (
  req,
  res
) => {
  try {
    const {
      serviceId,
      vehicleDetails,
      bookingDate,
      timeSlot,
      address,
      phone,
      notes
    } = req.body;

    if (
      !serviceId ||
      !vehicleDetails ||
      !bookingDate ||
      !timeSlot ||
      !address ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "Service, vehicle details, date, time slot, address and phone are required"
      });
    }

    const {
      brand,
      model,
      year,
      registrationNumber
    } = vehicleDetails;

    if (
      !brand ||
      !model ||
      !year ||
      !registrationNumber
    ) {
      return res.status(400).json({
        message:
          "Complete vehicle details are required"
      });
    }

    const selectedDate = new Date(
      bookingDate
    );

    if (
      Number.isNaN(selectedDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid booking date"
      });
    }

    const endOfSelectedDate = new Date(
      selectedDate
    );

    endOfSelectedDate.setHours(
      23,
      59,
      59,
      999
    );

    if (endOfSelectedDate < new Date()) {
      return res.status(400).json({
        message:
          "Booking date cannot be in the past"
      });
    }

    const service = await Service.findById(
      serviceId
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    if (!service.isAvailable) {
      return res.status(400).json({
        message:
          "This service is currently unavailable"
      });
    }

    const booking =
      await ServiceBooking.create({
        user: req.user._id,
        service: service._id,
        serviceName: service.name,
        servicePrice: service.startingPrice,
        vehicleDetails: {
          brand,
          model,
          year: Number(year),
          registrationNumber
        },
        bookingDate: selectedDate,
        timeSlot,
        address,
        phone,
        notes: notes || "",
        status: "Pending"
      });

    const populatedBooking =
      await ServiceBooking.findById(
        booking._id
      )
        .populate("user", "name email")
        .populate(
          "service",
          "name category image duration"
        );

    return res.status(201).json({
      message:
        "Service booked successfully",
      booking: populatedBooking
    });
  } catch (error) {
    console.log(
      "Create service booking error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create service booking"
    });
  }
};

/*
  Get logged-in customer's bookings
  Access: Customer
*/
const getMyServiceBookings = async (
  req,
  res
) => {
  try {
    const bookings =
      await ServiceBooking.find({
        user: req.user._id
      })
        .populate(
          "service",
          "name category image duration isAvailable"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.log(
      "Get my service bookings error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch your service bookings"
    });
  }
};

/*
  Get every service booking
  Access: Admin and Manager
*/
const getAllServiceBookings = async (
  req,
  res
) => {
  try {
    const {
      status = "",
      service = ""
    } = req.query;

    const filter = {};

    if (status.trim()) {
      filter.status = status.trim();
    }

    if (service.trim()) {
      filter.service = service.trim();
    }

    const bookings =
      await ServiceBooking.find(filter)
        .populate(
          "user",
          "name email role"
        )
        .populate(
          "service",
          "name category image duration"
        )
        .sort({
          bookingDate: 1,
          createdAt: -1
        });

    return res.status(200).json({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.log(
      "Get all service bookings error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch service bookings"
    });
  }
};

/*
  Get one booking
  Customer can only view their own booking
  Admin and Manager can view any booking
*/
const getServiceBookingById = async (
  req,
  res
) => {
  try {
    const booking =
      await ServiceBooking.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email role"
        )
        .populate(
          "service",
          "name category description image duration isAvailable"
        );

    if (!booking) {
      return res.status(404).json({
        message:
          "Service booking not found"
      });
    }

    const isOwner =
      booking.user._id.toString() ===
      req.user._id.toString();

    const isStaff = [
      "Admin",
      "Manager"
    ].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    return res.status(200).json({
      booking
    });
  } catch (error) {
    console.log(
      "Get service booking error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        message:
          "Invalid service booking ID"
      });
    }

    return res.status(500).json({
      message:
        "Failed to fetch service booking"
    });
  }
};

/*
  Update booking status
  Access: Admin and Manager
*/
const updateServiceBookingStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "In Progress",
      "Completed",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status"
      });
    }

    const booking =
      await ServiceBooking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        message:
          "Service booking not found"
      });
    }

    if (booking.status === "Completed") {
      return res.status(400).json({
        message:
          "Completed bookings cannot be changed"
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message:
          "Cancelled bookings cannot be changed"
      });
    }

    booking.status = status;

    await booking.save();

    const updatedBooking =
      await ServiceBooking.findById(
        booking._id
      )
        .populate("user", "name email")
        .populate(
          "service",
          "name category image duration"
        );

    return res.status(200).json({
      message:
        "Booking status updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.log(
      "Update booking status error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        message:
          "Invalid service booking ID"
      });
    }

    return res.status(500).json({
      message:
        "Failed to update booking status"
    });
  }
};

/*
  Cancel own booking
  Access: Customer
*/
const cancelServiceBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await ServiceBooking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        message:
          "Service booking not found"
      });
    }

    if (
      booking.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only cancel your own booking"
      });
    }

    if (booking.status === "Completed") {
      return res.status(400).json({
        message:
          "Completed bookings cannot be cancelled"
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message:
          "Booking is already cancelled"
      });
    }

    if (booking.status === "In Progress") {
      return res.status(400).json({
        message:
          "A service already in progress cannot be cancelled"
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    return res.status(200).json({
      message:
        "Service booking cancelled successfully",
      booking
    });
  } catch (error) {
    console.log(
      "Cancel service booking error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        message:
          "Invalid service booking ID"
      });
    }

    return res.status(500).json({
      message:
        "Failed to cancel service booking"
    });
  }
};

module.exports = {
  createServiceBooking,
  getMyServiceBookings,
  getAllServiceBookings,
  getServiceBookingById,
  updateServiceBookingStatus,
  cancelServiceBooking
};