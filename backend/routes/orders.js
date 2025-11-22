import express from "express";
import db from "../db.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();
router.post("/", verifyToken, async (req, res) => {
  try {
    const { cart, total } = req.body;
    if (!cart || !cart.length) return res.status(400).json({ message: "Cart empty" });
    const [result] = await db.query("INSERT INTO orders (user_id, total, status) VALUES (?,?, 'unpaid')", [req.user.id, total]);
    const orderId = result.insertId;
    const promises = cart.map(item =>
      db.query("INSERT INTO order_items (order_id, product_id, variant_id, quantity, size) VALUES (?,?,?,?,?)",
        [orderId, item.productId, item.variantId, item.quantity || 1, item.size || null])
    );
    await Promise.all(promises);

    res.json({ message: "Order created", orderId });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.id, o.total, o.status, o.transaction_id, o.created_at, u.name AS user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    for (const o of orders) {
      const [items] = await db.query(`
        SELECT oi.*, p.name AS product_name, v.size AS variant_size, v.price AS variant_price, v.image AS variant_image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN product_variants v ON oi.variant_id = v.id
        WHERE oi.order_id = ?
      `, [o.id]);
      o.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/mark-paid", verifyToken, isAdmin, async (req, res) => {
  try {
    const trx = "ADMIN-" + Date.now();
    await db.query("UPDATE orders SET status='paid', transaction_id=? WHERE id=?", [trx, req.params.id]);
    res.json({ message: "Order marked paid", transaction_id: trx });
  } catch (err) {
    console.error("Mark paid error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;


