import express from 'express';
import authMW from '../middleware/authMiddleware.js';
import Order from '../models/order.model.js';
const { verifyToken, isAdmin } = authMW;
const router = express.Router();

// Get all orders (admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's orders
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new order
router.post("/", verifyToken, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user.id,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status (admin only)
router.patch("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
