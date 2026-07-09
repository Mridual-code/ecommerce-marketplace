const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const Cart = require("../models/Cart");

// ================= ADMIN DASHBOARD =================

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Admin dashboard fetched successfully",
      stats: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ================= MANAGER DASHBOARD =================

const getManagerDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    const lowStockProducts = await Product.countDocuments({
  stock: { $lte: 5 }
});

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Manager dashboard fetched successfully",
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        lowStockProducts,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ================= CUSTOMER DASHBOARD =================

const getCustomerDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({
      user: req.user._id
    });

    const pendingOrders = await Order.countDocuments({
      user: req.user._id,
      status: "Pending"
    });

    const deliveredOrders = await Order.countDocuments({
      user: req.user._id,
      status: "Delivered"
    });

    const spending = await Order.aggregate([
      {
        $match: {
          user: req.user._id,
          status: { $ne: "Cancelled" }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);

    const cart = await Cart.findOne({
      user: req.user._id
    });

    const cartItems = cart ? cart.items.length : 0;

    res.status(200).json({
      message: "Customer dashboard fetched successfully",
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalSpent: spending[0]?.totalSpent || 0,
        cartItems
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getAdminDashboard,
  getManagerDashboard,
  getCustomerDashboard
};