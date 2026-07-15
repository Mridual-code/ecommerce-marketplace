const express = require("express");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  updateServiceAvailability
} = require(
  "../controllers/serviceController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

/*
  Public routes
*/

// View all services
router.get("/", getServices);

// View one service
router.get("/:id", getServiceById);


/*
  Admin and Manager routes
*/

// Create service
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  createService
);

// Update service
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  updateService
);

// Enable or disable service
router.patch(
  "/:id/availability",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  updateServiceAvailability
);

// Delete service
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  deleteService
);

module.exports = router;