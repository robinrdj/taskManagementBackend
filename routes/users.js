const express = require("express");
const pool = require("../db");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users
router.get("/", async (_, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

module.exports = router;
