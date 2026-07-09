const express = require("express");

const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProfile,
  changePassword
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  getAllUsers
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.put(
  "/:id/role",
  authMiddleware,
  roleMiddleware("Admin"),
  updateUserRole
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteUser
);

module.exports = router;