const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  deleteProduct
);

router.patch(
  "/:id/stock",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  updateStock
);

module.exports = router;