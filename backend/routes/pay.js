import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/", verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "orderId required" });

    const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (!rows.length) return res.status(404).json({ message: "Order not found" });

    const order = rows[0];
    if (order.user_id !== req.user.id && !req.user.is_admin) return res.status(403).json({ message: "Not allowed" });

    const transactionId = "MOCK-" + uuidv4();
    await db.query("UPDATE orders SET status='paid', transaction_id=? WHERE id=?", [transactionId, orderId]);

    res.json({ message: "Payment successful", transactionId });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

