const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    res.status(200).json({
      message: "Product added to cart",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    res.status(200).json({
      message: "Cart fetched successfully",
      cart: cart || { items: [] }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    res.status(200).json({
      message: "Cart quantity updated",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(200).json({
      message: "Cart cleared successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
};