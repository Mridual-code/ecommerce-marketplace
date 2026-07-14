const Product = require("../models/Product");
const Category = require("../models/Category");

const createProduct = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        message: "Product category is required"
      });
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Selected category does not exist"
      });
    }

    const productData = {
      ...req.body
    };

    delete productData.type;

    const product = await Product.create(productData);

    const populatedProduct = await Product.findById(product._id).populate({
      path: "category",
      populate: {
        path: "department"
      }
    });

    res.status(201).json({
      message: "Product created successfully",
      product: populatedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, category, department } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          brand: {
            $regex: search,
            $options: "i"
          }
        },
        {
          model: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (department) {
      const departmentCategories = await Category.find({
        department
      }).select("_id");

      const categoryIds = departmentCategories.map(
        (item) => item._id
      );

      if (category) {
        const belongsToDepartment = categoryIds.some(
          (id) => id.toString() === category.toString()
        );

        if (!belongsToDepartment) {
          return res.status(200).json({
            message: "Products fetched successfully",
            products: []
          });
        }
      } else {
        filter.category = {
          $in: categoryIds
        };
      }
    }

    const products = await Product.find(filter)
      .populate({
        path: "category",
        populate: {
          path: "department"
        }
      })
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      message: "Products fetched successfully",
      products
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "category",
      populate: {
        path: "department"
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body
    };

    delete productData.type;

    if (productData.category) {
      const existingCategory = await Category.findById(
        productData.category
      );

      if (!existingCategory) {
        return res.status(404).json({
          message: "Selected category does not exist"
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: "category",
      populate: {
        path: "department"
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (
      stock === undefined ||
      Number.isNaN(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        message: "Please provide a valid stock quantity"
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stock: Number(stock)
      },
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: "category",
      populate: {
        path: "department"
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Stock updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock
};