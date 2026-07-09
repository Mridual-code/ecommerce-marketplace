const express = require("express");

const {
  getDashboardStats
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  getDashboardStats
);

module.exports = router;