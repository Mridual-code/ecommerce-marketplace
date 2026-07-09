const express = require("express");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  addToCart
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  getCart
);

router.put(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  updateCartQuantity
);

router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  removeFromCart
);

router.delete(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  clearCart
);

module.exports = router;