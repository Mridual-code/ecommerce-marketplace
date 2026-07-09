const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  placeOrder
);

router.get(
  "/my-orders",
  authMiddleware,
  roleMiddleware("Customer"),
  getMyOrders
);

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  getAllOrders
);

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  updateOrderStatus
);

module.exports = router;