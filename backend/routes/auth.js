import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name,email,password) VALUES (?,?,?)", [name, email, hash]);
    res.json({ message: "Registered" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(400).json({ message: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const payload = { id: user.id, is_admin: user.is_admin, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

import { verifyToken } from "../middleware/auth.js";
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, is_admin FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

