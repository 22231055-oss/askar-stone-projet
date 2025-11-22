import express from "express";
import multer from "multer";
import path from "path";
import db from "../db.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();
const UPLOAD_DIR = path.join(process.cwd(), "uploads","contact");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});
const upload = multer({ storage });

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { message } = req.body;
    const image = req.file ? req.file.filename : null;
    await db.query("INSERT INTO messages (user_id, message, image) VALUES (?,?,?)", [req.user.id, message || null, image]);
    res.json({ message: "Message sent" });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.id, m.message, m.image, m.created_at, u.name AS user_name
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
