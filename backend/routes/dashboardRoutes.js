const express = require("express");

const {
  getAdminDashboard,
  getManagerDashboard,
  getCustomerDashboard
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();
console.log("Dashboard routes loaded");

/* ================= ADMIN ================= */

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("Admin"),
  getAdminDashboard
);

/* ================= MANAGER ================= */

router.get(
  "/manager",
  authMiddleware,
  roleMiddleware("Manager"),
  getManagerDashboard
);

/* ================= CUSTOMER ================= */

router.get(
  "/customer",
  authMiddleware,
  roleMiddleware("Customer"),
  getCustomerDashboard
);

module.exports = router;