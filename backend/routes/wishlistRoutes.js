const express = require("express");

const {
  getWishlist,
  toggleWishlistProduct,
  checkWishlistProduct,
  getWishlistCount
} = require(
  "../controllers/wishlistController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("Customer")
);

router.get("/", getWishlist);
router.get("/count", getWishlistCount);
router.get(
  "/check/:productId",
  checkWishlistProduct
);
router.patch(
  "/toggle/:productId",
  toggleWishlistProduct
);

module.exports = router;