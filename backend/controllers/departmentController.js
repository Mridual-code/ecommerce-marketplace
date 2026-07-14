const Department = require("../models/Department");
const Category = require("../models/Category");

const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Department name is required"
      });
    }

    const existingDepartment = await Department.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i"
      }
    });

    if (existingDepartment) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    const department = await Department.create({
      name: name.trim(),
      description
    });

    res.status(201).json({
      message: "Department created successfully",
      department
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Departments fetched successfully",
      departments
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.status(200).json({
      message: "Department fetched successfully",
      department
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    const updatedName = name?.trim() || department.name;

    const duplicateDepartment = await Department.findOne({
      _id: {
        $ne: req.params.id
      },
      name: {
        $regex: `^${updatedName}$`,
        $options: "i"
      }
    });

    if (duplicateDepartment) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    department.name = updatedName;

    if (description !== undefined) {
      department.description = description;
    }

    await department.save();

    res.status(200).json({
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    const categoryCount = await Category.countDocuments({
      department: req.params.id
    });

    if (categoryCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete this department because categories are using it"
      });
    }

    await department.deleteOne();

    res.status(200).json({
      message: "Department deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};