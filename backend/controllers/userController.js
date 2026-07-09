const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["Admin", "Manager", "Customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProfile,
  changePassword
};