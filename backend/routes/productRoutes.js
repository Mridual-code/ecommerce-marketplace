const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    if (!name || !description || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: "All product fields are required" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Product price cannot be negative" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Product stock cannot be negative" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: "Product price cannot be negative" });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ message: "Product stock cannot be negative" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock,
        category,
        image
      },
      { new: true }
    ).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;