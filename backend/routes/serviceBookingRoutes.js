const express = require("express");

const {
  createServiceBooking,
  getMyServiceBookings,
  getAllServiceBookings,
  getServiceBookingById,
  updateServiceBookingStatus,
  cancelServiceBooking
} = require(
  "../controllers/serviceBookingController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

/*
  Customer routes
*/

// Create service booking
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  createServiceBooking
);

// View logged-in customer's bookings
// Keep /my before /:id
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("Customer"),
  getMyServiceBookings
);

// Cancel logged-in customer's booking
router.patch(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("Customer"),
  cancelServiceBooking
);


/*
  Admin and Manager routes
*/

// View every service booking
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  getAllServiceBookings
);

// Update booking status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  updateServiceBookingStatus
);


/*
  Shared authenticated route

  Customer can view their own booking.
  Admin and Manager can view any booking.
  The controller checks ownership.
*/

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "Customer",
    "Admin",
    "Manager"
  ),
  getServiceBookingById
);

module.exports = router;