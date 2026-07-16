const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id
    }).populate({
      path: "products",
      populate: {
        path: "category",
        populate: {
          path: "department"
        }
      }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: []
      });
    }

    return res.status(200).json({
      wishlist
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch wishlist"
    });
  }
};

const toggleWishlistProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: []
      });
    }

    const exists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      wishlist.products.pull(productId);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    return res.status(200).json({
      message: exists
        ? "Removed from wishlist"
        : "Added to wishlist",
      added: !exists,
      count: wishlist.products.length
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update wishlist"
    });
  }
};

const checkWishlistProduct = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
      products: req.params.productId
    });

    return res.status(200).json({
      added: Boolean(wishlist)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to check wishlist"
    });
  }
};

const getWishlistCount = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id
    });

    return res.status(200).json({
      count: wishlist?.products?.length || 0
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch wishlist count"
    });
  }
};

module.exports = {
  getWishlist,
  toggleWishlistProduct,
  checkWishlistProduct,
  getWishlistCount
};