const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");

const getDashboardStats = async (req, res) => {
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
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboardStats
};