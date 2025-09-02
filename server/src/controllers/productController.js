// server/src/controllers/productController.js
import Product from "../models/Product.js";

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching products" });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const p = await Product.findOne({ slug: req.params.slug });
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching product" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, slug, price, calories, imageUrl, tags = [], isFeatured = false } = req.body;
    if (!name || !slug || price == null) {
      return res.status(400).json({ message: "name, slug, and price are required" });
    }
    const exists = await Product.findOne({ slug });
    if (exists) return res.status(409).json({ message: "Slug already exists" });

    const doc = await Product.create({
      name,
      slug,
      price: Number(price),
      calories: calories != null ? Number(calories) : undefined,
      imageUrl,
      tags,
      isFeatured,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error creating product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.price != null) update.price = Number(update.price);
    if (update.calories != null) update.calories = Number(update.calories);

    const doc = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ message: "Product not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Product.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Product not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting product" });
  }
};
