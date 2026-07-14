const express = require("express");

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getDepartments);

router.get("/:id", getDepartmentById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  createDepartment
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  deleteDepartment
);

module.exports = router;