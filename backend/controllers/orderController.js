const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const {
  advanceOrderTracking
} = require("../utils/orderTracking");

const allowedStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(404).json({
          message: "A product no longer exists"
        });
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}`
        });
      }
    }

    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      totalAmount +=
        item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    const estimatedDeliveryDate = new Date();

    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + 3
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      estimatedDeliveryDate,
      trackingHistory: [
        {
          status: "Pending",
          timestamp: new Date()
        }
      ]
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock: -item.quantity
          }
        }
      );
    }

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    let orders = await Order.find({
      user: req.user._id
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    for (const order of orders) {
      await advanceOrderTracking(order);
    }

    orders = await Order.find({
      user: req.user._id
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (
      req.user.role === "Customer" &&
      order.user._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    await advanceOrderTracking(order);

    order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    return res.status(200).json({
      message: "Order fetched successfully",
      order
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    for (const order of orders) {
      await advanceOrderTracking(order);
    }

    orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All orders fetched successfully",
      orders
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== status) {
      order.status = status;

      order.trackingHistory.push({
        status,
        timestamp: new Date()
      });

      if (status === "Delivered") {
        order.deliveredAt = new Date();
      }

      await order.save();
    }

    return res.status(200).json({
      message:
        "Order status updated successfully",
      order
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};