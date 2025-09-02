// server/src/controllers/orderController.js
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }
    const clean = items.map(i => ({
      slug:  String(i.slug),
      name:  String(i.name),
      price: Number(i.price),
      qty:   Number(i.qty || 1),
    }));
    const subtotal = clean.reduce((s, i) => s + i.price * i.qty, 0);

    const order = await Order.create({
      user: req.user._id,
      items: clean,
      subtotal,
      status: "paid",
    });

    res.json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error creating order" });
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
