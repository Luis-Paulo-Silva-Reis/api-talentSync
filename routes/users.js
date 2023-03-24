const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  pool.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Error inserting user into database: " + err.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const userId = result.insertId;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ userId, name, email, token });
  });
});

router.post("/auth", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT id, name, email, password FROM users WHERE email = ?";
  pool.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error selecting user from database: " + err.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 1) {
      const passwordMatch = await bcrypt.compare(password, results[0].password);
      if (passwordMatch) {
        const token = jwt.sign(
          { userId: results[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        res.json({
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          token: token,
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

router.post("/auth", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT id, name, email, password FROM users WHERE email = ?";
  pool.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error selecting user from database: " + err.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 1) {
      const passwordMatch = await bcrypt.compare(password, results[0].password);
      if (passwordMatch) {
        const token = jwt.sign(
          { userId: results[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        res.json({
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          token: token,
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

router.get("/protected", verifyToken, (req, res) => {
  // Os dados do usuário estão disponíveis na propriedade "user" do objeto "req"
  const userData = req.user;

  // Você pode enviar uma resposta JSON que inclua os dados do usuário:
  res.json({
    message: "This is a protected route",
    user: userData,
  });
});

module.exports = router;
