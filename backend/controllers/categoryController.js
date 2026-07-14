const Category = require("../models/Category");
const Department = require("../models/Department");
const Product = require("../models/Product");

const createCategory = async (req, res) => {
  try {
    const { name, description, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({
        message: "Category name and department are required"
      });
    }

    const existingDepartment = await Department.findById(department);

    if (!existingDepartment) {
      return res.status(404).json({
        message: "Selected department does not exist"
      });
    }

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i"
      },
      department
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists in this department"
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      department
    });

    const populatedCategory = await Category.findById(
      category._id
    ).populate("department");

    res.status(201).json({
      message: "Category created successfully",
      category: populatedCategory
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const { department } = req.query;

    const filter = {};

    if (department) {
      filter.department = department;
    }

    const categories = await Category.find(filter)
      .populate("department")
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      message: "Categories fetched successfully",
      categories
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "department"
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      category
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, department } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    const updatedName = name?.trim() || category.name;
    const updatedDepartment = department || category.department;

    const existingDepartment = await Department.findById(
      updatedDepartment
    );

    if (!existingDepartment) {
      return res.status(404).json({
        message: "Selected department does not exist"
      });
    }

    const duplicateCategory = await Category.findOne({
      _id: {
        $ne: req.params.id
      },
      name: {
        $regex: `^${updatedName}$`,
        $options: "i"
      },
      department: updatedDepartment
    });

    if (duplicateCategory) {
      return res.status(400).json({
        message: "Category already exists in this department"
      });
    }

    category.name = updatedName;
    category.department = updatedDepartment;

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    const populatedCategory = await Category.findById(
      category._id
    ).populate("department");

    res.status(200).json({
      message: "Category updated successfully",
      category: populatedCategory
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    const productCount = await Product.countDocuments({
      category: req.params.id
    });

    if (productCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete this category because products are using it"
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};